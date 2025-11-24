import { NextResponse } from "next/server";
import { getAllUsersWithAuth } from "@/service/allUser.service";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get auth user (admin API)
    const authUsers = await getAllUsersWithAuth();

    // Get profile dari tabel "users" (database)
    const { data: profiles, error } = await supabase
      .from("users")
      .select("*");

    if (error) throw error;

    // Gabungkan auth + profile
    const merged = profiles.map((profile) => {
      const authUser = authUsers.find((u) => u.id === profile.id);
      return {
        ...profile,
        email: authUser?.email || "-",
        last_sign_in_at: authUser?.last_sign_in_at || null,
        created_at_auth: authUser?.created_at || null,
      };
    });

    return NextResponse.json({ users: merged });
  } catch (err) {
    console.error("Error fetching all users:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
