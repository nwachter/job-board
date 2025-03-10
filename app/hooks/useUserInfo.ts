// import { useState, useEffect } from "react";
// import { getUserInfo } from "../services/auth";
// import { User } from "../types/user";

import { User } from "@/app/types/user";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { getOfferById, getUserInfo } from "../services";

// export const useUserInfo = () => {
//     const [userInfo, setUserInfo] = useState<Omit<User, "password"> | null>(null);
//     const [error, setError] = useState<string>("");
//     const [isLoading, setIsLoading] = useState<boolean>(true);

//     useEffect(() => {
//         const fetchAllUserInfo = async () => {
//             try {
//                 const data = await getUserInfo() ?? null;
//                 const userInfo = data?.user;

//                 // const userInfoData = await getUserById("placeholder");
//                 // console.log("userInfoData : ", userInfo);
//                 setUserInfo(userInfo);
//                 return userInfo;
//             }
//             catch (error) {
//                 console.error("Erreur lors de la récupération des informations de l'utilisateur courant", error);
//                 setError("Erreur lors de la récupération des informations de l'utilisateur courant");
//             }
//             finally {
//                 setIsLoading(false);
//             }
//         }
//         fetchAllUserInfo();
//     }, []);

//     return { data: userInfo, isLoading: isLoading, error: error };
// }



// export const getToken = () => {
//     const token = localStorage.getItem('token');
//     if(token) {
//         return JSON.parse(token);
//     } else {
//         return null
//     }
// }

export const useGetUserInfo = (): UseQueryResult<Omit<User, "password"> | null> => {
    return useQuery<Omit<User, "password"> | null>({
      queryKey: ["getUserInfo"],
      queryFn: getUserInfo,
    });
  };

  /*

      id: number;
    username: string;
    email: string;
    role: string;
    avatar: string;
    password: string;
    applications?: Application[];
    offers?: Offer[];
    createdAt?: Date;
    updatedAt?: Date;

  */