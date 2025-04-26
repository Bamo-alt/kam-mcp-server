import { BaseRemoteTool } from "./BaseTool.js";
import { z } from "zod";

class SendCodeToKamTool extends BaseRemoteTool {
  name = "send_code_to_kam";
  description =
    "Send JS code to Kam for execution. The code will be inserted into a template with access to the Kam Document and parameters. Your code should be written to work within the Execute method of the template.";

  inputSchema = z.object({
    code: z
      .string()
      .describe(
        "The JS code to execute in Kam. This code will be inserted into the Execute method of a template with access to Document and parameters."
      ),
    parameters: z
      .array(z.any())
      .optional()
      .describe(
        "Optional execution parameters that will be passed to your code"
      ),
  });
}

export default SendCodeToKamTool;
