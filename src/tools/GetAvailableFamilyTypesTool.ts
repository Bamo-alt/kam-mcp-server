import { BaseRemoteTool } from "./BaseTool.js";
import { z } from "zod";

class GetAvailableFamilyTypesTool extends BaseRemoteTool {
  name = "get_available_family_types";
  description =
    "Get available family types in the current KAM project. You can filter by category and limit the number of returned types.";

  inputSchema = z.object({
    categoryList: z
      .array(z.string())
      .optional()
      .describe(
        `List of KAM category names to filter by 
          (e.g., 'Wall', 'Column', 'Floor', 'Beam', 'Room')`
      ),
    limit: z
      .number()
      .optional()
      .describe("Maximum number of family types to return"),
  });
}

export default GetAvailableFamilyTypesTool;
