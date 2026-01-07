import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL;

async function proxyRequest(
  request: NextRequest,
  path: string[],
  method: string,
) {
  console.log("DEBUG PROXY - BACKEND_URL utilisé :", BACKEND_URL);
  console.log("DEBUG PROXY - Chemin appelé :", path.join("/"));
  if (!BACKEND_URL) {
    return NextResponse.json(
      { error: "BACKEND_API_URL not configured" },
      { status: 500 },
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${BACKEND_URL}/${path.join("/")}${
      searchParams ? `?${searchParams}` : ""
    }`;

    const headers: HeadersInit = {};
    const authHeader = request.headers.get("authorization");
    const contentType = request.headers.get("content-type");

    if (authHeader) headers["Authorization"] = authHeader;
    if (contentType) headers["Content-Type"] = contentType;

    const body =
      method === "GET" || method === "DELETE"
        ? undefined
        : await request.text();

    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error("[Proxy Error]", error);
    return NextResponse.json(
      { error: "Backend connection failed" },
      { status: 502 },
    );
  }
}

export const GET = (req: NextRequest, ctx: any) =>
  proxyRequest(req, ctx.params.path, "GET");
export const POST = (req: NextRequest, ctx: any) =>
  proxyRequest(req, ctx.params.path, "POST");
export const PUT = (req: NextRequest, ctx: any) =>
  proxyRequest(req, ctx.params.path, "PUT");
export const DELETE = (req: NextRequest, ctx: any) =>
  proxyRequest(req, ctx.params.path, "DELETE");
export const PATCH = (req: NextRequest, ctx: any) =>
  proxyRequest(req, ctx.params.path, "PATCH");
