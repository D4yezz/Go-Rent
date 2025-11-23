
import { api } from "@/config/api";
import axios from "axios";
// import { supabaseService } from "@/lib/supabase/admin";

export const login = async (payload) => {
  try {
    const response = await api.post("/login", payload);
    return response.data;
  } catch (error) {
    console.error("Login service error:", error);

    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }

    return {
      status: false,
      pesan: "Network error",
    };
  }
};

export const register = async (payload) => {
  try {
    const response = await api.post("/register", payload);
    return response.data;
  } catch (error) {
    console.error("Register service error:", error);

    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }

    return {
      status: false,
      pesan: "Network error",
    };
  }
};

export const getProfileUser = async () => {
  try {
    const response = await api.get("/profile");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return {
          status: false,
          data: null,
          pesan: "Unauthorized",
        };
      }
      return error.response?.data;
    }

    return {
      status: false,
      data: null,
      pesan: "Network error",
    };
  }
};


export const logout = async () => {
  try {
    const response = await api.post("/logout");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      status: false,
      pesan: "Network error",
    };
  }
};

// export const ForgotPassword = async (email) => {
//   const { data } = await supabaseService.listUsers();
//   const userEmail = email;

//   const user = data.users.find((u) => u.email === userEmail);

//   if (!user) {
//     return {
//       status: false,
//       pesan: "Tidak Dapat Menemukan Email",
//     };
//   }
//   try {
//     const response = await api.post("/forgot-password", user);
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       return error.response.data;
//     }
//   }
// };

// export const UpdatePassword = async (password) => {
//   try {
//     const response = await api.post("/update-password", password);
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       return error.response.data;
//     }
//     return {
//       status: false,
//       pesan: "Network error",
//     };
//   }
// };