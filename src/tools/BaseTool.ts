import {
  ContentResult,
  ImageContent,
  TextContent,
  Tool,
  ToolParameters,
} from "fastmcp";
import connectionManager from "../remote/connect-manager.js";
import { StandardSchemaV1 } from "@standard-schema/spec";
import logger from "../utils/logger.js";

export abstract class BaseRemoteTool<
  Params extends ToolParameters = ToolParameters
> implements Tool<Record<string, unknown>, Params>
{
  abstract name: string;
  abstract description: string;
  abstract parameters: Params;

  protected beforeExecute(params: Params): Promise<void> {
    logger.info(
      `Executing tool: ${this.name} with params: ${JSON.stringify(params)}`
    );
    return Promise.resolve();
  }

  protected afterExecute(result: unknown): Promise<void> {
    logger.info(
      `Tool: ${this.name} executed result: ${JSON.stringify(result)}`
    );
    return Promise.resolve();
  }

  async execute(
    args: StandardSchemaV1.InferOutput<Params>
  ): Promise<string | ContentResult | TextContent | ImageContent> {
    try {
      const response = await connectionManager.sendCommand(this.name, args);

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
