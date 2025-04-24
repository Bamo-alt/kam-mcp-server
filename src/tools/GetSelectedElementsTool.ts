import { BaseRemoteTool } from "../base/BaseRemoteTool.js";
import { z } from "zod";

interface GetSelectedElementsInput {
  limit?: number;
}

class GetSelectedElementsTool extends BaseRemoteTool<GetSelectedElementsInput> {
  name = "get_selected_elements";
  description =
    "Get elements currently selected in KAM. You can limit the number of returned elements.";

  schema = {
    limit: {
      type: z.number().optional(),
      description: "Maximum number of elements to return",
    },
  };
}

export default GetSelectedElementsTool;
