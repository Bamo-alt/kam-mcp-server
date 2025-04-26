import { BaseRemoteTool } from "./BaseTool.js";
import { z } from "zod";
class GetCurrentViewInfoTool extends BaseRemoteTool {
  name = "get_current_view_info";
  description =
    "Get detailed information about the current active view in KAM, including floor level data and basic information of all components in the view.";

  inputSchema = z.object({});
}

export default GetCurrentViewInfoTool;
