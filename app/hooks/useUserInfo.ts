import { useState, useEffect } from "react";

import { DecodedToken } from "../types/misc";
import jwt from "jsonwebtoken";

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState<DecodedToken | null>(null);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAllUserInfo = async () => {
            try {
                const userInfo = getUserInfo();

                // const userInfoData = await getUserById("placeholder");
                console.log("userInfoData : ", userInfo);
                setUserInfo(userInfo);
                return userInfo;
            }
            catch (error) {
                console.error("Erreur lors de la récupération des offres", error);
                setError("Erreur lors de la récupération des offres");
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchAllUserInfo();
    }, []);

    return { data: userInfo, isLoading: isLoading, error: error };
}

export const getUserInfo = () => {
    const userInfo = localStorage.getItem('userInfo');
    if(userInfo) {
        return JSON.parse(userInfo);
    } else return null;
}

export const getToken = () => {
    const token = localStorage.getItem('token');
    if(token) {
        return JSON.parse(token);
    } else {
        return null
    }
}