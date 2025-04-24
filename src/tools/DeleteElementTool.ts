import { BaseRemoteTool } from "../base/BaseRemoteTool.js";
import { z } from "zod";

interface DeleteElementInput {
  elementIds: string[];
}

class DeleteElementTool extends BaseRemoteTool<DeleteElementInput> {
  name = "delete_element";
  description =
    "Delete one or more elements from the KAM model by their element IDs.";

  schema = {
    elementIds: {
      type: z.array(z.string()),
      description: "The IDs of the elements to delete",
    },
  };
}

export default DeleteElementTool;
