import { BaseRemoteTool } from "./BaseTool.js";
import { z } from "zod";

class CreateSurfaceBasedElementTool extends BaseRemoteTool {
  name = "create_surface_based_element";
  description =
    "Create one or more surface-based elements in KAM such as floors, ceilings, or roofs. Supports batch creation with detailed parameters including family type ID, boundary lines, thickness, and level information. All units are in millimeters (mm). will return the ids of the created elements";

  parameters = z.object({
    data: z
      .array(
        z.object({
          name: z
            .string()
            .describe("Description of the element (e.g., floor, ceiling)"),
          typeId: z
            .number()
            .optional()
            .describe("The ID of the family type to create."),
          boundary: z
            .object({
              outerLoop: z
                .array(
                  z.object({
                    p0: z.object({
                      x: z.number().describe("X coordinate of start point"),
                      y: z.number().describe("Y coordinate of start point"),
                      z: z.number().describe("Z coordinate of start point"),
                    }),
                    p1: z.object({
                      x: z.number().describe("X coordinate of end point"),
                      y: z.number().describe("Y coordinate of end point"),
                      z: z.number().describe("Z coordinate of end point"),
                    }),
                  })
                )
                .min(3)
                .describe("Array of line segments defining the boundary"),
            })
            .describe("Boundary definition with outer loop"),
          thickness: z.number().describe("Thickness of the element"),
          baseLevel: z.number().describe("Base level height"),
          baseOffset: z.number().describe("Offset from the base level"),
        })
      )
      .describe("Array of surface-based elements to create"),
  });
}

export default CreateSurfaceBasedElementTool;
