import { useState, useEffect } from "react";
import { login, logout } from "../services/auth";
import { User } from "../types/user";

export const useLogin = (data: {email: string, password: string}) => {
    const [info, setInfo] = useState<User | null>(null);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        const fetchAllInfo = async (email : string, password: string) => {
            try {
                const infoData = await login({email, password});
                console.log("infoData : ", infoData);
                setInfo(infoData);
            }
            catch (error) {
                console.error("Erreur lors de la récupération des offres", error);
                setError("Erreur lors de la récupération des offres");
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchAllInfo(data?.email, data?.password);

    }, []);

    return { data: info, isLoading: isLoading, error: error };
}

export const useLogout = () => { 
    // const [error, setError] = useState<string>("");
    // const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const logoutFromApp = async () => {
            try {
                 await logout();
            }
            catch (error) {
                console.error("Erreur lors du logout", error);
                // setError("Erreur lors de la récupération des offres");
            }
            finally {
                // setIsLoading(false);
            }
        }

        logoutFromApp();

    }, []);



}