import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

async function getUserFromAuthHeader(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const token = auth?.split(" ")[1];
  if (!token) return null;
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.auth.getUser(token);
  if (error) return null;
  return data.user ?? null;
}

export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "code requerido" }, { status: 400 });
  }

  const user = await getUserFromAuthHeader(req);
  if (!user) {
    return NextResponse.json({ error: "Sesión requerida" }, { status: 401 });
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.RIOT_REDIRECT_URI!,
  });
  const basic = Buffer.from(
    `${process.env.RIOT_CLIENT_ID!}:${process.env.RIOT_CLIENT_SECRET!}`
  ).toString("base64");
  const tokRes = await fetch("https://auth.riotgames.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body,
  });
  if (!tokRes.ok) {
    const t = await tokRes.text();
    return NextResponse.json(
      { error: "token_exchange_failed", details: t },
      { status: 400 }
    );
  }
  const tokens = await tokRes.json();

  const uiRes = await fetch("https://auth.riotgames.com/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const userinfo = await uiRes.json();

  const admin2 = getSupabaseAdmin();
  const { error } = await admin2
    .from("user_identities")
    .upsert(
      {
        user_id: user.id,
        provider: "riot",
        sub: userinfo.sub,
        cpid: userinfo.cpid ?? null,
        created_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.redirect(new URL("/dashboard?linked=riot", req.url));
}
