const DEFAULT_PORT = 8765;
/**
 * @returns 端口号 从命令行参数获取 --port 8765
 */
export function getPort() {
  //  端口号 从命令行参数获取 --port 8765
  const portArg =
    process.argv.find((arg) => arg.startsWith("--port="))?.split("=")[1] ??
    process.argv[process.argv.indexOf("--port") + 1];

  if (portArg === undefined) {
    return DEFAULT_PORT;
  }

  const port = parseInt(portArg);
  if (isNaN(port)) {
    return DEFAULT_PORT;
  }
  return port;
}
