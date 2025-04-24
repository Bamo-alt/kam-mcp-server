import { z } from "zod";
import { BaseRemoteTool } from "../base/BaseRemoteTool.js";

interface CreatePointBasedElementInput {
  data: {
    name?: string;
    tag?: string;
    typeId: number;
    locationPoint: {
      x: number;
      y: number;
      z: number;
    };
    width: number;
    depth?: number;
    height: number;
    radius?: number;
    baseLevel: number;
    baseOffset: number;
    rotation?: number;
  }[];
}

class CreatePointBasedElementTool extends BaseRemoteTool<CreatePointBasedElementInput> {
  name = "create_point_based_element";
  description =
    "Create one or more point-based elements in KAM such as Column, Opening. Supports batch creation with detailed parameters including family type ID, position, dimensions, and level information. All units are in millimeters (mm). will return the ids of the created elements";

  schema = {
    data: {
      type: z.array(
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
      ),
      description: "Array of point-based elements to create",
    },
  };
}

export default CreatePointBasedElementTool;
