import { BaseRemoteTool } from "../base/BaseRemoteTool.js";
import { z } from "zod";

interface GetAvailableFamilyTypesInput {
  categoryList?: string[];
  limit?: number;
}

class GetAvailableFamilyTypesTool extends BaseRemoteTool<GetAvailableFamilyTypesInput> {
  name = "get_available_family_types";
  description =
    "Get available family types in the current KAM project. You can filter by category and limit the number of returned types.";

  schema = {
    categoryList: {
      type: z.array(z.string()).optional(),
      description: `List of KAM category names to filter by 
          (e.g., 'Wall', 'Column', 'Floor', 'Beam', 'Room')`,
    },
    limit: {
      type: z.number().optional(),
      description: "Maximum number of family types to return",
    },
  };
}

export default GetAvailableFamilyTypesTool;
