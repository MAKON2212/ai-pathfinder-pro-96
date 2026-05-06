import handler from "@tanstack/react-start/server-entry";

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      return await (
        handler as {
          fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
        }
      ).fetch(request, env, ctx);
    } catch (error) {
      console.error("[server] unhandled error:", error);
      const message = error instanceof Error ? `${error.message}\n${error.stack ?? ""}` : String(error);
      return new Response(
        JSON.stringify({ status: 500, message: "ServerError", detail: message }),
        { status: 500, headers: { "content-type": "application/json" } },
      );
    }
  },
};
