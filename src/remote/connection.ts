import WebSocket, { WebSocketServer } from "ws";
import { EventEmitter } from "events";
import { v4 as uuidv4 } from "uuid";
import * as http from "http";

// 定义命令接口
interface KamCommandRequest {
  id: string;
  type: string;
  params: Record<string, any>;
}

// 定义响应接口
interface KamResponse {
  id: string;
  status: "success" | "error";
  result?: any;
  message?: string;
}

export class KamRemoteConnection extends EventEmitter {
  public readonly port: number;
  private server: WebSocketServer;
  private clients: Map<WebSocket, { id: string; lastActivity: number }> =
    new Map();
  private pendingCommands: Map<
    string,
    {
      resolve: (value: any) => void;
      reject: (reason: any) => void;
      timeout: NodeJS.Timeout;
    }
  > = new Map();
  private commandTimeout: number = 15000; // 15秒超时
  private pingInterval: number = 30000; // 30秒心跳间隔
  private pingTimer: NodeJS.Timeout | null = null;

  constructor(port: number) {
    super();
    this.port = port;
    // 创建 HTTP 服务器处理 CORS 预检请求
    const httpServer = http.createServer((req, res) => {
      // 处理 OPTIONS 预检请求
      if (req.method === "OPTIONS") {
        res.writeHead(204, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        });
        res.end();
        return;
      }

      // 处理其他 HTTP 请求
      res.writeHead(404);
      res.end();
    });

    // 创建 WebSocket 服务器并附加到 HTTP 服务器
    this.server = new WebSocketServer({
      server: httpServer,
      verifyClient: (info: any, done: (arg0: boolean) => void) => {
        // 允许所有来源连接
        done(true);
      },
    });

    // 启动 HTTP 服务器
    //httpServer.listen(this.port);

    // 设置事件处理程序
    this.setupEventHandlers();
  }

  // 启动服务器
  public start(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.server.on("listening", () => {
        this.startPingTimer();
        resolve();
      });

      // 启动 HTTP 服务器
      this.server.options.server?.listen(this.port);
    });
  }

  // 停止服务器
  public stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // 清理心跳计时器
      if (this.pingTimer) {
        clearInterval(this.pingTimer);
        this.pingTimer = null;
      }

      // 清理所有挂起的命令
      for (const {
        resolve,
        reject,
        timeout,
      } of this.pendingCommands.values()) {
        clearTimeout(timeout);
        reject(new Error("Server shutting down"));
      }
      this.pendingCommands.clear();

      // 关闭所有客户端连接
      for (const client of this.clients.keys()) {
        client.close(1000, "Server shutting down");
      }

      // 关闭服务器
      this.server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // 发送命令到 Kam
  public async sendCommand(
    commandType: string,
    params: Record<string, any> = {}
  ): Promise<any> {
    // 检查是否有可用客户端
    if (this.clients.size === 0) {
      throw new Error("No Kam clients connected");
    }

    // 找到最近活动的客户端
    const client = this.getMostRecentClient();

    // 创建命令ID
    const commandId = uuidv4();

    // 创建命令对象
    const command: KamCommandRequest = {
      id: commandId,
      type: commandType,
      params,
    };

    // 返回 Promise
    return new Promise<any>((resolve, reject) => {
      // 设置超时
      const timeout = setTimeout(() => {
        // 如果命令超时，从挂起命令中移除
        if (this.pendingCommands.has(commandId)) {
          this.pendingCommands.delete(commandId);
          reject(
            new Error(
              `Command ${commandType} timed out after ${this.commandTimeout}ms`
            )
          );
        }
      }, this.commandTimeout);

      // 存储挂起的命令
      this.pendingCommands.set(commandId, { resolve, reject, timeout });

      // 发送命令
      client.send(JSON.stringify(command), (err) => {
        clearTimeout(timeout);
        this.pendingCommands.delete(commandId);
        reject(new Error(`Failed to send command: ${err?.message}`));
      });
    });
  }

  // 获取当前连接的客户端数量
  public getClientCount(): number {
    return this.clients.size;
  }

  // 检查是否有客户端连接
  public hasConnectedClients(): boolean {
    return this.clients.size > 0;
  }

  // 私有方法：设置事件处理程序
  private setupEventHandlers(): void {
    // 处理新连接
    this.server.on(
      "connection",
      (socket: WebSocket, request: { socket: { remoteAddress: any } }) => {
        const clientId = uuidv4();

        // 存储客户端信息
        this.clients.set(socket, {
          id: clientId,
          lastActivity: Date.now(),
        });

        // 发送欢迎消息
        socket.send(
          JSON.stringify({
            type: "welcome",
            message: "Connected to KamMCP WebSocket Server",
            clientId,
          })
        );

        // 通知客户端连接事件
        this.emit("clientConnected", clientId);

        // 处理消息
        socket.on("message", (data) => {
          try {
            // 更新最后活动时间
            const clientInfo = this.clients.get(socket);
            if (clientInfo) {
              clientInfo.lastActivity = Date.now();
            }

            // 解析消息
            const message = JSON.parse(String(data));

            // 处理响应
            if (
              message.id &&
              (message.status === "success" || message.status === "error")
            ) {
              this.handleResponse(message);
            }
            // 处理心跳
            else if (message.type === "pong") {
              // console.info(`Received pong from client ${clientId}`);
            }
            // 处理其他消息类型
            else {
              // console.info(
              //   `Received message from client ${clientId}: ${JSON.stringify(
              //     message
              //   )}`
              // );
            }
          } catch (error) {
            throw new Error(`Error processing message: ${error}`);
          }
        });

        // 处理关闭
        socket.on("close", (code, reason) => {
          // console.info(
          //   `Client ${clientId} disconnected (Code: ${code}, Reason: ${reason})`
          // );
          this.clients.delete(socket);
          this.emit("clientDisconnected", clientId);
        });

        // 处理错误
        socket.on("error", (error: any) => {
          throw new Error(`WebSocket error for client ${clientId}: ${error}`);
        });
      }
    );

    // 处理服务器错误
    this.server.on("error", (error: any) => {
      throw new Error(`WebSocket server error: ${error}`);
    });
  }

  // 私有方法：处理来自 Kam 的响应
  private handleResponse(response: KamResponse): void {
    // 查找挂起的命令
    const pendingCommand = this.pendingCommands.get(response.id);

    if (pendingCommand) {
      // 清除超时
      clearTimeout(pendingCommand.timeout);

      // 从挂起命令中移除
      this.pendingCommands.delete(response.id);

      // 处理响应
      if (response.status === "success") {
        pendingCommand.resolve(response.result);
      } else {
        pendingCommand.reject(
          new Error(response.message || "Unknown error from Kam")
        );
      }
    } else {
      throw new Error(`Received response for unknown command ID: ${response.id}`);
    }
  }

  // 私有方法：获取最近活动的客户端
  private getMostRecentClient(): WebSocket {
    let mostRecent: WebSocket | null = null;
    let lastActivity = 0;

    for (const [client, info] of this.clients.entries()) {
      if (info.lastActivity > lastActivity) {
        mostRecent = client;
        lastActivity = info.lastActivity;
      }
    }

    if (!mostRecent) {
      throw new Error("No clients available");
    }

    return mostRecent;
  }

  // 私有方法：启动心跳计时器
  private startPingTimer(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
    }

    this.pingTimer = setInterval(() => {
      this.pingClients();
    }, this.pingInterval);
  }

  // 私有方法：发送心跳到所有客户端
  private pingClients(): void {
    const now = Date.now();
    const timeoutThreshold = now - this.pingInterval * 2;

    // 检查和移除超时的客户端
    for (const [client, info] of this.clients.entries()) {
      if (info.lastActivity < timeoutThreshold) {
        client.close(1000, "Connection timed out");
        this.clients.delete(client);
        this.emit("clientDisconnected", info.id);
        continue;
      }

      // 发送 ping
      try {
        client.send(JSON.stringify({ type: "ping", timestamp: now }));
      } catch (error) {
        throw new Error(`Error sending ping to client ${info.id}: ${error}`);
      }
    }
  }
}
