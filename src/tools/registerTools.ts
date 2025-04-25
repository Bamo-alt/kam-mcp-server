import { FastMCP } from "fastmcp";
import CreateLineBasedElementTool from "./CreateLineBasedElementTool.js";
import CreatePointBasedElementTool from "./CreatePointBasedElementTool.js";
import CreateSurfaceBasedElementTool from "./CreateSurfaceBasedElementTool.js";
import DeleteElementTool from "./DeleteElementTool.js";
import GetAvailableFamilyTypesTool from "./GetAvailableFamilyTypesTool.js";
import GetCurrentViewElementsTool from "./GetCurrentViewElementsTool.js";
import GetCurrentViewInfoTool from "./GetCurrentViewInfoTool.js";
import GetSelectedElementsTool from "./GetSelectedElementsTool.js";
import SendCodeToKamTool from "./SendCodeToKamTool.js";

export function registerTools(server: FastMCP) {
  server.addTool(new CreateLineBasedElementTool());
  server.addTool(new CreatePointBasedElementTool());
  server.addTool(new CreateSurfaceBasedElementTool());
  server.addTool(new DeleteElementTool());
  server.addTool(new GetAvailableFamilyTypesTool());
  server.addTool(new GetCurrentViewElementsTool());
  server.addTool(new GetCurrentViewInfoTool());
  server.addTool(new GetSelectedElementsTool());
  server.addTool(new SendCodeToKamTool());
}
