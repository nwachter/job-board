
// import { useState, useEffect } from "react";
// import { getOffers } from "../services/offers";
// import { Offer } from "../types/offer";

// export const useOffers = () => {
//     const [offers, setOffers] = useState<Offer[]>([]);
//     const [error, setError] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [contractTypes, setContractTypes] = useState<string[]>([])
//     const [applicationsNumber, setApplicationsNumber] = useState<number>(0);

//     useEffect(() => {
//         const fetchAllOffers = async () => {
//             try {
//                 const offersData = await getOffers();
//                 console.log("offersData : ", offersData);
//                 setOffers(offersData);
//                 const contractTypes : string[] = offersData?.length > 0 ? Array.from(new Set(offersData.map((offer : Offer) => offer.contract_type))) : [];
//                 const applicationsNumber : number = offersData?.reduce((acc : number, offer : Offer) => acc + (offer.applications ? offer.applications.length : 0), 0) || 0;
//                 setContractTypes(contractTypes);
//                 setApplicationsNumber(applicationsNumber);      
//             }
//             catch (error) {
//                 console.error("Erreur lors de la récupération des offres", error);
//                 setError("Erreur lors de la récupération des offres");
//             }
//             finally {
//                 setIsLoading(false);
//             }
//         }

//          fetchAllOffers();

//     }, []);

//     return { data: offers, contractTypes: contractTypes, isLoading: isLoading, applicationsNumber: applicationsNumber, error: error };
// }

// "use client";
// import { useState, useEffect } from "react";
// import { getApplications } from "../services/applications";
// import { Application } from "../types/application";

import {  Offer } from "@/app/types/offer";
import { UseQueryResult, useQuery, UseMutationResult, useQueryClient, useMutation, UseQueryOptions } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { getApplications, getApplicationById, createApplication, updateApplication, searchApplications, deleteApplication, createOffer, deleteOffer, getOfferById, getOffers, searchOffers, updateOffer } from "../services";

// export const useApplications = () => {
//     const [applications, setApplications] = useState<Application[]>([]);
//     const [error, setError] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(true);

//     useEffect(() => {
//         const fetchAllApplications = async () => {
//             try {
//                 const {data: applicationsData} = await getApplications();
//                 console.log("applicationsData : ", applicationsData);
//                 setApplications(applicationsData);
//             }
//             catch (error) {
//                 console.error("Erreur lors de la récupération des offres", error);
//                 setError("Erreur lors de la récupération des offres");
//             }
//             finally {
//                 setIsLoading(false);
//             }
//         }

//          fetchAllApplications();

//     }, []);

//     return { data: applications, isLoading: isLoading, error: error };
// }


// type OffersData = {
//     data: Offer[];
//     contractTypes: string[];
//     applicationsNumber: number;
//   };
  
  export const useGetOffers = (): UseQueryResult<Offer[]> => {
    return useQuery<Offer[]>({
      queryKey: ["getOffers"],
      queryFn: async () => {
        // const offers = await getOffers(); // Ajout de await
  
        // const contractTypes: string[] =
        //   offers?.length > 0
        //     ? Array.from(new Set(offers.map((offer: Offer) => offer.contract_type)))
        //     : [];
  
        // const applicationsNumber: number =
        //   offers?.reduce((acc: number, offer: Offer) => acc + (offer?.applications ? offer?.applications.length : 0), 0) || 0;
  
        // return { data: offers, contractTypes, applicationsNumber };
        return await getOffers();
      },
    });
  };
  
  export const useGetOfferById = (
    offerId: number,
  ): UseQueryResult<Offer> => {
    return useQuery<Offer>({
      queryKey: ["getOfferById", offerId],
      queryFn: () => getOfferById(offerId),
    });
  };
  
//   export const useGetOffersByUserId = (
//     userId: string,
//   ): UseQueryResult<Offer[]> => {
//     return useQuery<Offer[], Error>({
//       queryKey: ["useGetOffersByUserId", userId],
//       queryFn: () => getOffersByUserId(userId),
//       enabled: !!userId,
//     });
//   };
  
  
  export const useCreateOffer = (): UseMutationResult<
    Offer,
    Error,
    { data: Omit<Offer, "id"> }
  > => {  
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["createOffer"],
      mutationFn: async ({ data }) => {
        return await createOffer(data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getOffers"] });
        queryClient.invalidateQueries({ queryKey: ["getOfferWithAverage"] });
  
      },
      onError: (error: Error) => {
      },
    });
  };
  
  export const useUpdateOffer = (): UseMutationResult<
    Offer,
    Error,
    { id: number; data: Partial<Offer> }
  > => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationKey: ["updateOffer"],
      mutationFn: async ({ id, data }) => {
        return await updateOffer(id, data);
      },
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["getOffers"] });
        queryClient.invalidateQueries({ queryKey: ["getOfferWithAverage"] });
        queryClient.invalidateQueries({
          queryKey: ["getOfferByIdWithScoresAndDetails"],
        });
  
        queryClient.invalidateQueries({ queryKey: ["getOfferById"] });
  
    
      },
      onError: (error: Error) => {
 
      },
    });
  };
  
  export const useDeleteOffer = (): UseMutationResult<void, Error, number> => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationKey: ["deleteOffer"],
      mutationFn: async (id: number) => {
        await deleteOffer(id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getOffers"] });
        queryClient.invalidateQueries({ queryKey: ["getOfferWithAverage"] });
        queryClient.invalidateQueries({
          queryKey: ["getOfferByIdWithScoresAndDetails"],
        });
        queryClient.invalidateQueries({ queryKey: ["getOfferById"] });
  
      },
      onError: (error: Error) => {

      },
    });
  };
  
  export const useSearchOffers = (
    query: string,
    options?: UseQueryOptions<Offer[], Error>,
  ): UseQueryResult<Offer[]> => {
    return useQuery<Offer[], Error>({
      queryKey: ["searchOffers", query],
      queryFn: () => searchOffers(query),
    });
  };
  