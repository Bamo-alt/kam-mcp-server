import { BaseRemoteTool } from "../base/BaseRemoteTool.js";

interface GetCurrentViewInfoInput {}

class GetCurrentViewInfoTool extends BaseRemoteTool<GetCurrentViewInfoInput> {
  name = "get_current_view_info";
  description =
    "Get detailed information about the current active view in KAM, including floor level data and basic information of all components in the view.";

  schema = {};
}

export default GetCurrentViewInfoTool;
