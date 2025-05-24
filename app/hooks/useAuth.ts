// import { useState, useEffect } from "react";
// import { login, logout } from "../services/auth";
// import { User } from "../types/user";

import { User } from "@/app/types/user";
import {
  UseMutationResult,
  useQueryClient,
  useMutation,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  getUserInfo,
  login,
  logout,
  register,
  RegisterType,
} from "../services/auth";
import { useRouter } from "next/navigation";
export interface LoginUser {
  email: string;
  password: string;
  accesToken?: string;
}

export const useRegister = (): UseMutationResult<
  User,
  Error,
  {
    data: Omit<
      User,
      "id" | "applications" | "offers" | "createdAt" | "updatedAt"
    >;
  } //tsterror removed "role"
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
    onError: (error: Error) => {},
  });
};

export const useLogin = (): UseMutationResult<any, Error, LoginUser> => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (loginUserDto: LoginUser) => {
      const response = await login(loginUserDto);
      return response;
    },
    onSuccess: async (data: any) => {
      const userInfo = (await getUserInfo()) ?? null;
      if (!userInfo) {
        console.error("User info cookie not found");
        return;
      }

      const userRole = Array.isArray(data.role) ? data.role[0] : data.role;
      switch (userRole) {
        case "ADMIN":
          router.push("/admin");
          break;
        case "RECRUITER":
          router.push("/dashboard");
          break;
        case "USER":
          router.push("/dashboard");
          break;
        default:
          router.push("/");
      }

      queryClient.invalidateQueries({ queryKey: ["login"] });
      queryClient.invalidateQueries({ queryKey: ["getUserInfo"] });
    },
    onError: (error: Error) => {},
  });
};

export const useLogout = (
  options?: UseQueryOptions<void, Error>,
): UseMutationResult<void, Error, any> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      await logout();
    },
    onSuccess: async () => {
      queryClient.clear();
      queryClient.invalidateQueries({ queryKey: ["getUserInfo"] });
      localStorage.removeItem("jobboard_user_info");
      localStorage.removeItem("token");
    },
    onError: (error: Error) => {},
  });
};
