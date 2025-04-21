"use client";
import { useState } from "react";
import { User } from "@prisma/client";
import { updateUser } from "../services/auth";

type UpdateUserData = {
  username?: string;
  email?: string;
  password?: {
    current: string;
    new: string;
  };
  avatar?: string;
  resume?: string;
};

type UpdateResponse = {
  success: boolean;
  message: string;
  user?: User;
};

export const useUserUpdate = (userId: number) => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateUserProfile = async (id: number, updateData: UpdateUserData): Promise<UpdateResponse> => {
    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add basic user data
      if (updateData.username) {
        formData.append("username", updateData.username);
      }
      
      if (updateData.email) {
        formData.append("email", updateData.email);
      }
      
      // Add password if provided
      if (updateData.password) {
        formData.append("currentPassword", updateData.password.current);
        formData.append("newPassword", updateData.password.new);
      }
      
      // Add files if provided
      if (updateData.avatar) {
        formData.append("avatar", updateData.avatar);
      }

      const updatedData = {
        username: updateData.username,
        email: updateData.email,
        password: updateData.password,
        avatar: updateData.avatar
      }
      
    //   if (updateData.resume) {
    //     formData.append("resume", updateData.resume);
    //   }

      // Make API request to update user
    //   const response = await fetch(`/api/users/${userId}`, {
    //     method: "PATCH",
    //     body: formData,
    //   });
      const result = await updateUser(id, updatedData)

    

   

      setSuccess("Profile updated successfully");
      return {
        success: true,
        message: "Profile updated successfully",
        user: result.user // testerror attention si le service retourne juste response.data 
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while updating profile";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateUser: updateUserProfile,
    isUpdating,
    error,
    success,
    clearMessages: () => {
      setError(null);
      setSuccess(null);
    }
  };
};