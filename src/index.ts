#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getTools } from "./tools/getTools.js";
import { BaseRemoteTool } from "./tools/BaseTool.js";
import connectionManager from "./remote/connect-manager.js";
import { zodToJsonSchema } from "zod-to-json-schema";

const toolsMap = new Map<string, BaseRemoteTool>(
  getTools().map((tool) => [tool.name, tool])
);

const server = new Server(
  {
    name: "kam-mcp-server",
    version: "0.0.8",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Array.from(toolsMap.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: zodToJsonSchema(tool.inputSchema),
    })),
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = toolsMap.get(request.params.name);
  if (!tool) {
    throw new Error("Unknown tool");
  }
  const input = tool.inputSchema.parse(request.params.arguments);
  const result = await tool.execute(input);
  return result;
});

async function startWebSocketServer() {
  await connectionManager.initialize();
}

// 优雅关闭函数
async function gracefulShutdown(returnCode: number = 0) {
  await connectionManager.shutdown();
  await server.close();
  process.exit(returnCode);
}

async function main() {
  await startWebSocketServer();

  // 处理进程信号，确保优雅关闭
  const transport = new StdioServerTransport();
  await server.connect(transport);

  server.onclose = () => {
    gracefulShutdown(0);
  };

  server.onerror = (error) => {
    gracefulShutdown(1)
  };

  console.info(
    JSON.stringify({
      type: "text",
      text: `kam-mcp-server started, port: ${connectionManager.port}`,
    })
  );
}

main().catch((error) => {
  gracefulShutdown(1)
});
