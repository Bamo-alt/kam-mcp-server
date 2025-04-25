import { FastMCP } from "fastmcp";
import KamDocResourceResource from "./KamDocResourceResource.js";

export function registerResources(server: FastMCP) {
  server.addResource(new KamDocResourceResource());
}
