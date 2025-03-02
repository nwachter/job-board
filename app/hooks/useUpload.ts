import { useState, useEffect } from "react";
import { login, logout } from "../services/auth";
import { User } from "../types/user";
import { uploadPdfFile } from "../services/upload";

export const useUpload = (data: File) => {
    const [fileLink, setFileLink] = useState()
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        const uploadFile = async (data: File) => {
            try {
                const fileLink = await uploadPdfFile(data);
                setFileLink(fileLink)
                console.log("fileLink : ", fileLink);
            }
            catch (error) {
                console.error("Erreur lors de l'upload du fichier PDF", error);
                setError("Erreur lors de l'upload du fichier PDF");
            }
            finally {
                setIsLoading(false);
            }
        }

        uploadFile(data);

    }, []);

    return { data: fileLink, isLoading: isLoading, error: error };
}
