import { logger } from "./logger.js";

const DEFAULT_PORT = 8765;
/**
 * @returns 端口号 从命令行参数获取 --port=8765
 */
export function getPort() {
  const portArg = process.argv
    .find((arg) => arg.startsWith("--port="))
    ?.split("=")[1];
  if (portArg === undefined) {
    logger.warn("No port provided, using default port 8765");
    return DEFAULT_PORT;
  }
  const port = parseInt(portArg);
  if (isNaN(port)) {
    logger.error("Invalid port provided, using default port 8765");
    return DEFAULT_PORT;
  }
  return port;
}
