import { updateSession } from "./lib/supabase/middleware/middleware";

export async function middleware(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/petugas/:path*",
    "/pelanggan/:path*",
    "/profile/:path*",
  ],
};
