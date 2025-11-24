import { NextResponse } from "next/server";

export async function POST(req) {
  const { userId } = await req.json();

  const res = await fetch(
    `https://ginztnhpnkprbnidripl.supabase.co/auth/v1/admin/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        apiKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Gagal menghapus user dari auth" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "User deleted" }, { status: 200 });
}