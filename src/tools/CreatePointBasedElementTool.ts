import { z } from "zod";
import { BaseRemoteTool } from "./BaseTool.js";

class CreatePointBasedElementTool extends BaseRemoteTool {
  name = "create_point_based_element";
  description =
    "Create one or more point-based elements in KAM such as Column, Opening. Supports batch creation with detailed parameters including family type ID, position, dimensions, and level information. All units are in millimeters (mm). will return the ids of the created elements";

  parameters = z.object({
    data: z
      .array(
        z.object({
          name: z
            .string()
            .optional()
            .describe("Name of the element (e.g., Column, Opening)"),
          tag: z.string().optional().describe("Tag of the element"),
          typeId: z
            .number()
            .describe(
              "The ID of the category type to create. 3 for Column, 4 for Opening"
            ),
          locationPoint: z
            .object({
              x: z.number().describe("X coordinate in mm"),
              y: z.number().describe("Y coordinate in mm"),
              z: z.number().describe("Z coordinate in mm"),
            })
            .describe(
              "The position coordinates where the element will be placed"
            ),
          width: z.number().describe("Width of the element in mm"),
          depth: z.number().optional().describe("Depth of the element in mm"),
          height: z.number().describe("Height of the element in mm"),
          radius: z
            .number()
            .optional()
            .describe("Radius of the circle column in mm"),
          baseLevel: z.number().describe("Base level height"),
          baseOffset: z.number().describe("Offset from the base level"),
          rotation: z
            .number()
            .optional()
            .describe("Rotation angle in radians (0-2PI)"),
        })
      )
      .describe("Array of point-based elements to create"),
  });
}

export default CreatePointBasedElementTool;
