import { Offer } from "@/app/types/offer";
import {
  UseQueryResult,
  useQuery,
  UseMutationResult,
  useQueryClient,
  useMutation,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  searchApplications,
  deleteApplication,
  createOffer,
  deleteOffer,
  getOfferById,
  getOffers,
  searchOffers,
  updateOffer,
  getOffersByRecruiterId,
} from "../services";

export const useGetOffers = (): UseQueryResult<Offer[]> => {
  return useQuery<Offer[]>({
    queryKey: ["getOffers"],
    queryFn: async () => {
      return await getOffers();
    },
  });
};

export const useGetOfferById = (offerId: number): UseQueryResult<Offer> => {
  return useQuery<Offer>({
    queryKey: ["getOfferById", offerId],
    queryFn: () => getOfferById(offerId),
  });
};

export const useGetOffersByRecruiterId = (recruiterId: number): UseQueryResult<Offer[]> => {
  return useQuery<Offer[], Error>({
    queryKey: ["useGetOffersByRecruiterId", recruiterId],
    queryFn: () => getOffersByRecruiterId(recruiterId),
    enabled: !!recruiterId,
  });
};

export const useCreateOffer = (): UseMutationResult<
  Offer,
  Error,
  { data: Omit<Offer, "id" | "createdAt" | "updatedAt"> }
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
    onError: (error: Error) => {},
  });
};

export const useUpdateOffer = (): UseMutationResult<Offer, Error, { id: number; data: Partial<Offer> }> => {
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
    onError: (error: Error) => {},
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
    onError: (error: Error) => {},
  });
};

export const useSearchOffers = (query: string, options?: UseQueryOptions<Offer[], Error>): UseQueryResult<Offer[]> => {
  return useQuery<Offer[], Error>({
    queryKey: ["searchOffers", query],
    queryFn: () => searchOffers(query),
  });
};
