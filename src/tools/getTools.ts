import CreateLineBasedElementTool from "./CreateLineBasedElementTool.js";
import CreatePointBasedElementTool from "./CreatePointBasedElementTool.js";
import CreateSurfaceBasedElementTool from "./CreateSurfaceBasedElementTool.js";
import DeleteElementTool from "./DeleteElementTool.js";
import GetAvailableFamilyTypesTool from "./GetAvailableFamilyTypesTool.js";
import GetCurrentViewElementsTool from "./GetCurrentViewElementsTool.js";
import GetCurrentViewInfoTool from "./GetCurrentViewInfoTool.js";
import GetSelectedElementsTool from "./GetSelectedElementsTool.js";
import SendCodeToKamTool from "./SendCodeToKamTool.js";

export function getTools() {
  return [
    new CreateLineBasedElementTool(),
    new CreatePointBasedElementTool(),
    new CreateSurfaceBasedElementTool(),
    new DeleteElementTool(),
    new GetAvailableFamilyTypesTool(),
    new GetCurrentViewElementsTool(),
    new GetCurrentViewInfoTool(),
    new GetSelectedElementsTool(),
    new SendCodeToKamTool(),
  ];
}
