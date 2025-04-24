import { BaseRemoteTool } from "../base/BaseRemoteTool.js";
import { z } from "zod";

interface GetCurrentViewElementsInput {
  categoryList?: string[];
  query?: {
    id?: string;
    includeHidden?: boolean;
    name?: string;
    tag?: string;
  };
  limit?: number;
}
class GetCurrentViewElementsTool extends BaseRemoteTool<GetCurrentViewElementsInput> {
  name = "get_current_view_elements";
  description =
    "Get elements from the current active view in KAM. You can filter by model categories (like Walls, Floors) or annotation categories (like Dimensions, Text). Use includeHidden to show/hide invisible elements and limit to control the number of returned elements.";

  schema = {
    categoryList: {
      type: z.array(z.string()).optional(),
      description:
        "List of KAM model category names (e.g., 'Wall', 'Floor', 'Beam', 'Room', 'Column')",
    },
    query: {
      type: z
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
        .optional(),
      description: "Query to filter elements",
    },
    limit: {
      type: z.number().optional(),
      description: "Maximum number of elements to return",
    },
  };
}

export default GetCurrentViewElementsTool;
