import { MCPTool, logger } from "mcp-framework";
import connectionManager from "../remote/connect-manager.js";

export abstract class BaseRemoteTool<
  TInput extends Record<string, any> = {}
> extends MCPTool<TInput> {
  abstract name: string;

  protected beforeExecute(params: TInput): Promise<TInput> {
    logger.info(
      `Executing tool: ${this.name} with params: ${JSON.stringify(params)}`
    );
    return Promise.resolve(params);
  }

  protected afterExecute(result: unknown): Promise<unknown> {
    logger.info(
      `Tool: ${this.name} executed result: ${JSON.stringify(result)}`
    );
    return Promise.resolve(result);
  }

  async execute(params: TInput): Promise<unknown> {
    try {
      const response = await connectionManager.sendCommand(
        "create_point_based_element",
        params
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Create point-based element failed: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  }
}
