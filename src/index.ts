import { FastMCP } from "fastmcp";
import connectionManager from "./remote/connect-manager.js";
import { registerTools } from "./tools/registerTools.js";
import { registerResources } from "./resources/registerResources.js";
import logger from "./utils/logger.js";

try {
  connectionManager.initialize();
  logger.info("connectionManager.initialize success");
} catch (e) {
  logger.error("connectionManager.initialize error", e);
}

const server = new FastMCP({
  name: "kam-mcp-server",
  version: "0.0.2",
});

registerResources(server);
registerTools(server);

server.start({
  transportType: "stdio",
});
