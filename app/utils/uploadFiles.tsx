import { UseMutationResult } from "@tanstack/react-query";
import React from "react";

export type Files = {
  image?: FileList | undefined;
  documents?: FileList | undefined;
};

export type UploadFilesProps = {
  image?: FileList | undefined;
  documents?: FileList | undefined;
};

export const uploadFiles = async (
  documents: FileList,
  uploadFilesMutation: UseMutationResult<
    string[],
    Error,
    {
      files: FormData;
      // path: string
    }
  >,
  //   filePath: string = API_PATH.PROPOSAL_DOCUMENT,
): Promise<string[] | undefined> => {
  if (!documents || documents.length === 0) {
    console.log("Aucun document à envoyer.");
    return [];
  }

  const formData = new FormData();

  // Append each file to the form data
  for (let i = 0; i < documents.length; i++) {
    const document = documents[i];
    if (document) {
      formData.append("documents", document);
    }
  }

  try {
    const result = await uploadFilesMutation.mutateAsync({
      files: formData,
      //   path: filePath,
    });

    return result; // Return the result from the mutation
  } catch (error) {
    console.error("Erreur durant l'upload des documents :", error);
    throw new Error("Erreur durant l'upload des documents : " + error);
  }
};

export const uploadImage = async (
  image: FileList | [],
  uploadFilesMutation: UseMutationResult<
    string[],
    Error,
    {
      files: FormData;
      // path: string
    }
  >,
  //   filePath: string = API_PATH.NEWS_IMAGE,
): Promise<string[] | undefined> => {
  if (!image || image.length === 0) {
    console.log("Aucune image à envoyer.");
    return [];
  }

  const formData = new FormData();
  if (image[0]) {
    formData.append("image", image[0]);
  } else return undefined;

  try {
    const result = await uploadFilesMutation.mutateAsync({
      files: formData,
    });

    return result; // Return the result from the mutation
  } catch (error) {
    console.error("Erreur durant l'upload d'image :", error);
    throw new Error("Erreur durant l'upload d'image : " + error);
  }
};

// export default UploadFiles;
