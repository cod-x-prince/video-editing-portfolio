// Tool definitions passed to the Anthropic Messages API.
// Keep this list minimal — every tool here is a surface the model can
// misuse, so only expose what the bot actually needs.

export const TOOLS = [
  {
    name: "create_booking_request",
    description:
      "Submit a booking request on behalf of the site visitor. This does NOT instantly confirm a slot — it creates a pending request that goes through manual review, same as the site's booking form. Only call this once you have all required fields.",
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Visitor's full name" },
        email: { type: "string", description: "Visitor's email address" },
        project_type: {
          type: "string",
          description:
            "What kind of project — e.g. podcast editing, talking-head long-form, motion graphics package",
        },
        preferred_window: {
          type: "string",
          description:
            "Visitor's preferred date/time or general availability window, in their own words (e.g. 'weekday afternoons next week'). Not a confirmed slot.",
        },
        notes: {
          type: "string",
          description: "Any extra context the visitor gave about the project",
        },
      },
      required: ["name", "email", "project_type", "preferred_window"],
    },
  },
] as const;

export type ToolName = (typeof TOOLS)[number]["name"];
