#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import rolesData from "./data/roles.json" with { type: "json" };

const SERVER_NAME = "four-leaf-mcp";
const SERVER_VERSION = "0.0.1";

const server = new Server(
  { name: SERVER_NAME, version: SERVER_VERSION },
  { capabilities: { tools: {} } },
);

const ListRolesInput = z.object({}).strict();
const GetRoleIntelligenceInput = z
  .object({
    role: z.string().describe("Role id (e.g. 'software_engineer', 'data_scientist', 'product_manager')."),
  })
  .strict();

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list_roles",
      description:
        "List the roles Four-Leaf has interview intelligence for. Returns role id + display name + short description for each.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
    },
    {
      name: "get_role_intelligence",
      description:
        "Get structured interview intelligence for a role: typical interview pipeline, experience-level calibration, question categories, scoring dimensions, resume + cover-letter guidance.",
      inputSchema: {
        type: "object",
        properties: {
          role: {
            type: "string",
            description:
              "Role id. Call list_roles first to see available ids.",
          },
        },
        required: ["role"],
        additionalProperties: false,
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "list_roles") {
    ListRolesInput.parse(args ?? {});
    const available = rolesData.roles.map((r) => ({
      id: r.id,
      displayName: r.displayName,
      description: r.description,
    }));
    const pending = (rolesData.pendingExtraction ?? []).map((id) => ({
      id,
      status: "pending_extraction",
      note: "Coming soon. Tracked publicly in the clover-public repo.",
    }));
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            { available, pending, version: rolesData.version },
            null,
            2,
          ),
        },
      ],
    };
  }

  if (name === "get_role_intelligence") {
    const parsed = GetRoleIntelligenceInput.parse(args);
    const role = rolesData.roles.find((r) => r.id === parsed.role);
    if (!role) {
      const pending: string[] = rolesData.pendingExtraction ?? [];
      const isPending = pending.includes(parsed.role);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: "role_not_found",
                requested: parsed.role,
                status: isPending ? "pending_extraction" : "unknown",
                hint: "Call list_roles to see available role ids.",
              },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(role, null, 2) }],
    };
  }

  return {
    content: [{ type: "text", text: `Unknown tool: ${name}` }],
    isError: true,
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(`${SERVER_NAME} v${SERVER_VERSION} ready on stdio\n`);
}

main().catch((err) => {
  process.stderr.write(`fatal: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
