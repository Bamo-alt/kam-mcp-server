import connectionManager from "../remote/connect-manager.js";
import { ZodTypeAny } from "zod";

type ToolParameters = Record<string, unknown>;

export abstract class BaseRemoteTool<
  Params extends ToolParameters = ToolParameters
> {
  abstract name: string;
  abstract description: string;

  abstract inputSchema: ZodTypeAny;

  protected beforeExecute(params: Params): Promise<void> {
    return Promise.resolve();
  }

  protected afterExecute(result: unknown): Promise<void> {
    return Promise.resolve();
  }

  async execute(args: Params): Promise<any> {
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
            text: `Create point-based element failed: ${error instanceof Error ? error.message : String(error)
              }`,
          },
        ],
      };
    }
  }
}
