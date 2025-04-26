import { z } from "zod";
import { BaseRemoteTool } from "./BaseTool.js";

class CreateLineBasedElementTool extends BaseRemoteTool {
  name = "create_line_based_element";
  description =
    "Create one or more line-based elements in KAM such as walls, beams, or pipes. Supports batch creation with detailed parameters including family type ID, start and end points, thickness, height, and level information. All units are in millimeters (mm). will return the ids of the created elements";

  inputSchema = z.object({
    data: z
      .array(
        z.object({
          tag: z.string().optional().describe("Tag of the element"),
          name: z.string().optional().describe("Name of the element"),
          typeId: z
            .number()
            .describe(
              "The ID of the category type to create. 1 for walls, 2 for beams."
            ),
          locationLine: z
            .object({
              p0: z.object({
                x: z.number().describe("X coordinate of start point in mm"),
                y: z.number().describe("Y coordinate of start point in mm"),
                z: z.number().describe("Z coordinate of start point in mm"),
              }),
              pm: z
                .object({
                  x: z.number().describe("X coordinate of start point in mm"),
                  y: z.number().describe("Y coordinate of start point in mm"),
                  z: z.number().describe("Z coordinate of start point in mm"),
                })
                .optional()
                .describe(
                  "The point on the curve that is the midpoint of the arc curve. Only used for arc curve, if not provided, the curve will be a straight line"
                ),
              p1: z.object({
                x: z.number().describe("X coordinate of end point in mm"),
                y: z.number().describe("Y coordinate of end point in mm"),
                z: z.number().describe("Z coordinate of end point in mm"),
              }),
            })
            .describe("The line defining the element's location"),
          thickness: z
            .number()
            .describe("Thickness/width of the element (e.g., wall thickness)"),
          height: z
            .number()
            .describe("Height of the element (e.g., wall height)"),
          baseLevel: z.number().describe("Base level height"),
          baseOffset: z.number().describe("Offset from the base level"),
        })
      )
      .describe("Array of line-based elements to create"),
  });
}

export default CreateLineBasedElementTool;
