import { NextResponse, type NextRequest } from "next/server";
import { ablyRestClient } from "@/lib/server/ably-rest-client";

export async function POST(req: NextRequest) {
  const clientId =
    (await req.formData()).get("clientId")?.toString() ||
    process.env.DEFAULT_CLIENT_ID ||
    "onLooker";
  const tokenRequestData = await ablyRestClient.auth.createTokenRequest({
    clientId: clientId,
  });
  return NextResponse.json(tokenRequestData);
}
