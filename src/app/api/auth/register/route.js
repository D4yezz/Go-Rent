// // file api/register
// import { createClient } from "@/lib/supabase/server";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req) {
//   const supabase = await createClient();

//   try {
//     const { email, password, confirm_password, username, no_hp } = await req.json();

//     // Validasi
//     if (password !== confirm_password) {
//       return NextResponse.json(
//         {
//           status: false,
//           pesan: "Password atau Konfirmasi Password tidak sesuai !",
//         },
//         { status: 400 }
//       );
//     }

//     // Hanya kirim email dan password ke Supabase Auth
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           username: username,
//           no_hp: no_hp,
//         }
//       }
//     });

//     if (error) {
//       console.error("Supabase signup error:", error); // Tambahkan log
//       return NextResponse.json(
//         {
//           status: false,
//           pesan: error.message,
//         },
//         { status: 400 }
//       );
//     }

//     // Insert ke table users
//     if (data.user) {
//       const { error: insertError } = await supabase.from("users").insert([{
//         id: data.user.id,
//         username: username,
//         email: email.trim(),
//         no_hp: no_hp,
//         role: "user",
//       }]);

//       if (insertError) {
//         console.error("Insert user error:", insertError);
//         // Optional: hapus user dari auth jika insert gagal
//       }
//     }

//     return NextResponse.json({
//       status: true,
//       data: data,
//     });
//   } catch (error) {
//     console.error("Register API error:", error);
//     return NextResponse.json(
//       {
//         status: false,
//         pesan: "Internal server error",
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req) {
  const supabase = await createClient();

  try {
    const { email, password, confirm_password, username, no_hp } =
      await req.json();

    // Validation
    if (!email || !password || !confirm_password || !username) {
      return NextResponse.json(
        { status: false, pesan: "Semua field wajib diisi!" },
        { status: 400 }
      );
    }

    if (password !== confirm_password) {
      return NextResponse.json(
        { status: false, pesan: "Password dan konfirmasi tidak sama!" },
        { status: 400 }
      );
    }

    // Register user ke auth Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { status: false, pesan: error.message },
        { status: 400 }
      );
    }

    // Insert detail user ke tabel "users"
    const userId = data.user.id;

    const { error: insertError } = await supabase.from("users").insert([
      {
        id: userId,
        username,
        email,
        no_hp,
        role: "user",
      },
    ]);

    if (insertError) {
      return NextResponse.json(
        { status: false, pesan: insertError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: true,
      pesan: "Register berhasil!",
      user: data.user,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: false, pesan: "Internal server error" },
      { status: 500 }
    );
  }
}
