"use client"
import { useState, useEffect } from "react";
import { createLocation, deleteLocation, getLocationById, getLocations, updateLocation } from "../services/locations";
import { Location } from "../types/location";
import { UseQueryResult, useQuery, UseMutationResult, useQueryClient, useMutation } from "@tanstack/react-query";

// export const useLocations = () => {
//     const [locations, setLocations] = useState<Location[]>();
//     const [error, setError] = useState<string>();
//     const [isLoading, setIsLoading] = useState<boolean>();

//     useEffect(() => {
//         const fetchAllLocations = async () => {
//             try {
//                 const locationsData = await getLocations();
//                 setLocations(locationsData);
//             }
//             catch (error) {
//                 console.error("Erreur lors de la récupération des lieux", error);
//                 setError("Erreur lors de la récupération des lieux");
//             }
//             finally {
//                 setIsLoading(false);
//             }
//         }

//         fetchAllLocations();

//     }, []);

//     return { data: locations, isLoading: isLoading, error: error };
// }

export const useGetLocations = (): UseQueryResult<Location[]> => {
    return useQuery<Location[]>({
      queryKey: ["getLocations"],
      queryFn: async () => {
        return await getLocations();
      },
    });
  };
  
  export const useGetLocationById = (
    locationId: number,
  ): UseQueryResult<Location> => {
    return useQuery<Location>({
      queryKey: ["getLocationById", locationId],
      queryFn: () => getLocationById(locationId),
    });
  };
  export const useCreateLocation = (): UseMutationResult<
    Location,
    Error,
    { data: Omit<Location, "id"> }
  > => {  
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["createLocation"],
      mutationFn: async ({ data }) => {
        return await createLocation(data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getLocations"] });
        queryClient.invalidateQueries({ queryKey: ["getLocationWithAverage"] });
  
      },
      onError: (error: Error) => {
      },
    });
  };
  
  export const useUpdateLocation = (): UseMutationResult<
    Location,
    Error,
    { id: number; data: Partial<Location> }
  > => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationKey: ["updateLocation"],
      mutationFn: async ({ id, data }) => {
        return await updateLocation(id, data);
      },
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["getLocations"] });
        queryClient.invalidateQueries({ queryKey: ["getLocationWithAverage"] });
        queryClient.invalidateQueries({
          queryKey: ["getLocationByIdWithScoresAndDetails"],
        });
  
        queryClient.invalidateQueries({ queryKey: ["getLocationById"] });
  
    
      },
      onError: (error: Error) => {
 
      },
    });
  };
  
  export const useDeleteLocation = (): UseMutationResult<void, Error, number> => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationKey: ["deleteLocation"],
      mutationFn: async (id: number) => {
        await deleteLocation(id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getLocations"] });
        queryClient.invalidateQueries({ queryKey: ["getLocationWithAverage"] });
        queryClient.invalidateQueries({
          queryKey: ["getLocationByIdWithScoresAndDetails"],
        });
        queryClient.invalidateQueries({ queryKey: ["getLocationById"] });
  
      },
      onError: (error: Error) => {

      },
    });
  };
