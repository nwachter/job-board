import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// import {
//   createUser,
//   getUserById,
//   getUsers,
//   searchUsers,
//   updateUser,

// } from "@/app/services/users";
import { User } from "../types/user";
import { getUsers, getUserById } from "../services/users";
import { updateUser, deleteUser, register } from "../services/auth";

//   import {
//     UpdatePasswordRequest,
//     UpdateUserPasswordRequest,
//   } from "../types/updatepassword";
// import { getSession } from "../api";

export const useGetUsers = (): UseQueryResult<User[]> => {
  return useQuery<User[]>({
    queryFn: getUsers,
    queryKey: ["getUsers"],
  });
};

export const useGetUserById = (userId: number): UseQueryResult<User> => {
  return useQuery<User>({
    queryKey: ["getUserById", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = (): UseMutationResult<
  User,
  Error,
  { id: number; data: Partial<Omit<User, "id" | "password">> }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const updatedUser = await updateUser(id, data);
      return updatedUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      queryClient.invalidateQueries({ queryKey: ["getUserById"] });
    },
    onError: (error: Error) => {
      // toast.error(`Échec de la mise à jour du user : ${error.message}`);
    },
  });
};

export const useDeleteUser = (): UseMutationResult<void, Error, number> => {
  return useMutation({
    mutationFn: async (id: number) => {
      const data = { deleted: true };
      await deleteUser(id);
    },
    onSuccess: () => {},
    onError: (error: Error) => {},
  });
};

// export const useSearchUsers = (
//   query: string,
//   options?: UseQueryOptions<User[], Error>,
// ): UseQueryResult<User[]> => {
//   return useQuery<User[], Error>({
//     queryKey: ["searchUsers", query],
//     queryFn: () => searchUsers(query),
//   });
// };
