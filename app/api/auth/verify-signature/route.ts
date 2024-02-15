import { getSignMessageTemplate } from "@/lib/utils/sign";
import { NextResponse, type NextRequest } from "next/server";
import { verifyMessage } from "viem";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { signature, ...rest } = body;

  const message = getSignMessageTemplate(rest);

  const verified = await verifyMessage({
    address: rest.address,
    message,
    signature,
  });

  if (!verified) {
    return NextResponse.json({ success: false });
  }
  // @TODO: Set a cookie or something to indicate that the user is logged in
  cookies().set("token", "token");
  return NextResponse.json({ success: true });
}