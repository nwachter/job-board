// import { useState, useEffect } from "react";
// import { login, logout } from "../services/auth";
// import { User } from "../types/user";

import { User } from "@/app/types/user";
import { UseMutationResult, useQueryClient, useMutation } from "@tanstack/react-query";
import { getUserInfo, login, logout, register } from "../services/auth";
import { useRouter } from "next/navigation";
export interface LoginUser {
    email: string;
    password: string;
    accesToken?: string;
  }
// export const useLogin = (data: {email: string, password: string}) => {
//     const [info, setInfo] = useState<User | null>(null);
//     const [error, setError] = useState<string>("");
//     const [isLoading, setIsLoading] = useState<boolean>(true);


//     useEffect(() => {
//         const fetchAllInfo = async (email : string, password: string) => {
//             try {
//                 const infoData = await login({email, password});
//                 console.log("infoData : ", infoData);
//                 setInfo(infoData);
//             }
//             catch (error) {
//                 console.error("Erreur lors de la récupération des offres", error);
//                 setError("Erreur lors de la récupération des offres");
//             }
//             finally {
//                 setIsLoading(false);
//             }
//         }

//         fetchAllInfo(data?.email, data?.password);

//     }, []);

//     return { data: info, isLoading: isLoading, error: error };
// }

// export const useLogout = () => { 
//     // const [error, setError] = useState<string>("");
//     // const [isLoading, setIsLoading] = useState<boolean>(true);

//     useEffect(() => {
//         const logoutFromApp = async () => {
//             try {
//                  await logout();
//             }
//             catch (error) {
//                 console.error("Erreur lors du logout", error);
//                 // setError("Erreur lors de la récupération des offres");
//             }
//             finally {
//                 // setIsLoading(false);
//             }
//         }

//         logoutFromApp();

//     }, []);



// }

export const useRegister = (): UseMutationResult<
User,
Error,
{ data: Omit<User, "id" | "role" | "applications" | "offers" | "createdAt" | "updatedAt"> }
> => {
const queryClient = useQueryClient();

return useMutation({
  mutationKey: ["createUser"],
  mutationFn: async ({ data }) => {
    const createdUser = await register(data);
    return createdUser?.user ?? null;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["getUsers"] });
  },
  onError: (error: Error) => {
  },
});
};


export const useLogin = (): UseMutationResult<
  any,
  Error,
  LoginUser
> => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (loginUserDto: LoginUser) => {
      const response = await login(loginUserDto);
      return response;
    },
    onSuccess: async (data: any) => {
      const userInfo = await getUserInfo() ?? null;
      if (!userInfo) {
        console.error("User info cookie not found");
        return
      } 

      const userRole = Array.isArray(data.role) ? data.role[0] : data.role;
      switch (userRole) {
        case "admin":
          router.push("/admin");
          break;
        case "recruiter":
          router.push("/dashboard");
          break;
        case "user":
          router.push("/dashboard");
          break;
        default:
          router.push("/");
      }

      queryClient.invalidateQueries({ queryKey: ["login"] });
    },
    onError: (error: Error) => {
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      await logout();
    },
    onSuccess: async () => {
      queryClient.clear();
      localStorage.removeItem("jobboard_user_info");
      localStorage.removeItem("token");

    },
    onError: (error: Error) => {
    },
  });
};