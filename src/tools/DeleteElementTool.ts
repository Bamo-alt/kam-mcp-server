import { BaseRemoteTool } from "./BaseTool.js";
import { z } from "zod";

class DeleteElementTool extends BaseRemoteTool {
  name = "delete_element";
  description =
    "Delete one or more elements from the KAM model by their element IDs.";

  parameters = z.object({
    elementIds: z
      .array(z.string())
      .describe("The IDs of the elements to delete"),
  });
}

export default DeleteElementTool;
