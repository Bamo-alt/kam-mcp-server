// src/connection-manager.ts
import { EventEmitter } from "events";
import { KamRemoteConnection } from "./connection.js";
import { getPort } from "../utils/getPort.js";
import logger from "../utils/logger.js";
// 定义连接状态类型
type ConnectionState = "stopped" | "starting" | "running" | "error";
// 连接管理器类
export class ConnectionManager extends EventEmitter {
  private connection: KamRemoteConnection | null = null;
  private state: ConnectionState = "stopped";
  private polyhavenEnabled: boolean = false;
  private port: number;

  constructor() {
    super();
    this.port = getPort();
  }

  // 获取当前连接状态
  public getState(): ConnectionState {
    return this.state;
  }

  // 初始化 WebSocket 服务器
  public async initialize(): Promise<void> {
    if (this.state === "running" || this.state === "starting") {
      logger.info("WebSocket server already running or starting");
      return;
    }

    this.state = "starting";
    this.emit("stateChange", this.state);

    try {
      // 创建 KamRemoteConnection 实例
      this.connection = new KamRemoteConnection(this.port);

      // 监听客户端连接/断开连接事件
      this.connection.on("clientConnected", (clientId) => {
        this.emit("clientConnected", clientId);
      });

      this.connection.on("clientDisconnected", (clientId) => {
        this.emit("clientDisconnected", clientId);
      });

      // 启动服务器
      await this.connection.start();

      this.state = "running";
      logger.info(`Kam MCP WebSocket server running on port ${this.port}`);
    } catch (error) {
      logger.error(
        `Failed to start WebSocket server: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      this.state = "error";
    }

    this.emit("stateChange", this.state);
  }

  // 检查是否有客户端连接
  public hasConnectedClients(): boolean {
    return !!this.connection && this.connection.hasConnectedClients();
  }

  // 获取客户端数量
  public getClientCount(): number {
    return this.connection ? this.connection.getClientCount() : 0;
  }

  // 检查是否已启动
  public isRunning(): boolean {
    return this.state === "running";
  }

  // 检查 PolyHaven 状态
  public isPolyhavenEnabled(): boolean {
    return this.polyhavenEnabled;
  }

  // 关闭服务器
  public async shutdown(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }

    this.state = "stopped";
    this.emit("stateChange", this.state);
    logger.info("KamMCP WebSocket server shut down");
  }

  // 发送命令到 Kam
  public async sendCommand(commandType: string, params: any): Promise<any> {
    console.log(`🚀 ~ ConnectionManager ~ sendCommand ~ params:`, params);
    if (!this.isRunning()) {
      throw new Error(
        "WebSocket server not running. Call initialize() first." + this.state
      );
    }

    if (!this.hasConnectedClients()) {
      throw new Error(
        "No Kam clients connected. Make sure the Kam addon is running and connected."
      );
    }

    try {
      const result = await this.connection!.sendCommand(commandType, params);
      return result;
    } catch (error) {
      logger.error(
        `Command error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      throw error;
    }
  }
}

// 创建单例实例
const connectionManager = new ConnectionManager();

// 导出单例
export default connectionManager;
