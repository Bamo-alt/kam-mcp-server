import { BaseRemoteTool } from "../base/BaseRemoteTool.js";
import { z } from "zod";

interface SendCodeToKamInput {
  code: string;
  parameters?: any[];
}

class SendCodeToKamTool extends BaseRemoteTool<SendCodeToKamInput> {
  name = "send_code_to_kam";
  description =
    "Send JS code to Kam for execution. The code will be inserted into a template with access to the Kam Document and parameters. Your code should be written to work within the Execute method of the template.";

  schema = {
    code: {
      type: z.string(),
      description:
        "The JS code to execute in Kam. This code will be inserted into the Execute method of a template with access to Document and parameters.",
    },
    parameters: {
      type: z.array(z.any()).optional(),
      description:
        "Optional execution parameters that will be passed to your code",
    },
  };
}

export default SendCodeToKamTool;
