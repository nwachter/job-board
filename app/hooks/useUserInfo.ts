import { useState, useEffect } from "react";
import { getUserInfo } from "../services/auth";
import { User } from "../types/user";

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState<Omit<User, "password"> | null>(null);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAllUserInfo = async () => {
            try {
                const data = await getUserInfo() ?? null;
                const userInfo = data?.user;

                // const userInfoData = await getUserById("placeholder");
                // console.log("userInfoData : ", userInfo);
                setUserInfo(userInfo);
                return userInfo;
            }
            catch (error) {
                console.error("Erreur lors de la récupération des informations de l'utilisateur courant", error);
                setError("Erreur lors de la récupération des informations de l'utilisateur courant");
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchAllUserInfo();
    }, []);

    return { data: userInfo, isLoading: isLoading, error: error };
}



export const getToken = () => {
    const token = localStorage.getItem('token');
    if(token) {
        return JSON.parse(token);
    } else {
        return null
    }
}