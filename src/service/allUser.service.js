import { supabaseService } from "@/lib/supabase/admin";

export const getAllUsersWithAuth = async () => {
  const { data, error } = await supabaseService.listUsers();
  if (error) throw error;

  return data.users.map((user) => ({
    id: user.id,
    email: user.email,
    last_sign_in_at: user.last_sign_in_at,
    created_at: user.created_at,
  }));
};  