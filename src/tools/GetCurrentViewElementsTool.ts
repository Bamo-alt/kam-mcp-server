import { BaseRemoteTool } from "./BaseTool.js";
import { z } from "zod";

class GetCurrentViewElementsTool extends BaseRemoteTool {
  name = "get_current_view_elements";
  description =
    "Get elements from the current active view in KAM. You can filter by model categories (like Walls, Floors) or annotation categories (like Dimensions, Text). Use includeHidden to show/hide invisible elements and limit to control the number of returned elements.";

  parameters = z.object({
    categoryList: z
      .array(z.string())
      .optional()
      .describe(
        "List of KAM model category names (e.g., 'Wall', 'Floor', 'Beam', 'Room', 'Column')"
      ),
    query: z
      .object({
        id: z
          .string()
          .optional()
          .describe("Id of the elements, first match will be returned"),
        includeHidden: z
          .boolean()
          .optional()
          .describe("Whether to include hidden elements in the results"),
        name: z.string().optional().describe("Name of the elements"),
        tag: z.string().optional().describe("Tag of the elements"),
      })
      .optional()
      .describe("Query to filter elements"),
    limit: z
      .number()
      .optional()
      .describe("Maximum number of elements to return"),
  });
}

export default GetCurrentViewElementsTool;
