import { NextResponse } from "next/server";

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.RIOT_CLIENT_ID!,
    redirect_uri: process.env.RIOT_REDIRECT_URI!,
    response_type: "code",
    scope: "openid offline_access cpid",
  });
  return NextResponse.redirect(
    `https://auth.riotgames.com/authorize?${params.toString()}`
  );
}
