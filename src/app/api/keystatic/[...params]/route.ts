import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";

type Handler = ReturnType<typeof makeRouteHandler>;
let handler: Handler | undefined;

function unavailable(message: string) {
  return new Response(message, {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function getHandler(): Handler | Response {
  // Local mode writes to disk without a login; it is never allowed on a deployed build.
  if (process.env.NODE_ENV !== "development" &&
      (config.storage.kind === "local" || process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "local")) {
    return unavailable("Local editing is available only with npm run dev.");
  }
  // Missing GitHub credentials must disable the editor, not the public website.
  if (process.env.NODE_ENV === "production" &&
      (!process.env.KEYSTATIC_GITHUB_CLIENT_ID || !process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || !process.env.KEYSTATIC_SECRET)) {
    return unavailable("The site editor needs its GitHub App credentials. See README.md for setup.");
  }
  if (!handler) {
    try {
      handler = makeRouteHandler({ config });
    } catch {
      return unavailable("The site editor is not configured yet. See README.md for setup.");
    }
  }
  return handler;
}

export async function GET(request: Request) {
  const result = getHandler();
  return result instanceof Response ? result : result.GET(request);
}

export async function POST(request: Request) {
  const result = getHandler();
  return result instanceof Response ? result : result.POST(request);
}
