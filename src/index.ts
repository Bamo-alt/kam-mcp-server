import { MCPServer } from "mcp-framework";
import connectionManager from "./remote/connect-manager.js";

try {
  connectionManager.initialize();
  console.log("connectionManager.initialize success");
} catch (e) {
  console.error("connectionManager.initialize error", e);
}

const server = new MCPServer({
  name: "kam-mcp-server",
  version: "0.0.1",
});

server.start();
