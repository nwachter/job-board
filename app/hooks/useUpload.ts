// import { useState, useEffect } from "react";
// import { login, logout } from "../services/auth";
// import { User } from "../types/user";
// import { uploadPdfFile } from "../services/upload";


import { UseMutationResult, useMutation } from "@tanstack/react-query";
import { uploadPdfFile } from "../services";


// export const useUpload = (data: File) => {
//     const [fileLink, setFileLink] = useState()
//     const [error, setError] = useState<string>("");
//     const [isLoading, setIsLoading] = useState<boolean>(true);


//     useEffect(() => {
//         const uploadFile = async (data: File) => {
//             try {
//                 const fileLink = await uploadPdfFile(data);
//                 setFileLink(fileLink)
//                 console.log("fileLink : ", fileLink);
//             }
//             catch (error) {
//                 console.error("Erreur lors de l'upload du fichier PDF", error);
//                 setError("Erreur lors de l'upload du fichier PDF");
//             }
//             finally {
//                 setIsLoading(false);
//             }
//         }


//         uploadFile(data);

//     }, []);

//     return { data: fileLink, isLoading: isLoading, error: error };
// }

export const useUploadFiles = (): UseMutationResult<
  string[],
  Error,
  { files: FileList; path: string }
> => {
  return useMutation<string[], Error, { files: FileList; path: string }>({
    mutationKey: ["uploadFiles"],
    mutationFn: async ({ files, path }) => {
      return await uploadPdfFile(files);
    },
    onSuccess: (data) => {
      console.log("Successfully uploaded files");
    },
    onError: (error: Error) => {
      console.log("Erreur lors du téléversement du fichier PDF");
    },
  });
};
