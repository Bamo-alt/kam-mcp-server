import { BaseRemoteTool } from "./BaseTool.js";
import { z } from "zod";

class GetSelectedElementsTool extends BaseRemoteTool {
  name = "get_selected_elements";
  description =
    "Get elements currently selected in KAM. You can limit the number of returned elements.";

  inputSchema = z.object({
    limit: z
      .number()
      .optional()
      .describe("Maximum number of elements to return"),
  });
}

export default GetSelectedElementsTool;
