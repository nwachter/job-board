// "use client";
// import { useState, useEffect } from "react";
// import { getApplications } from "../services/applications";
// import { Application } from "../types/application";

import { Application } from "@/app/types/application";
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
  getApplicationsByUserId,
  getRecruiterApplicationsStatisticsForChart,
  ChartDataPoint,
} from "../services";

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

export const useGetApplications = (): UseQueryResult<Application[]> => {
  return useQuery<Application[]>({
    queryKey: ["getApplications"],
    queryFn: getApplications,
  });
};

export const useGetApplicationById = (
  applicationId: number,
): UseQueryResult<Application> => {
  return useQuery<Application>({
    queryKey: ["getApplicationById", applicationId],
    queryFn: () => getApplicationById(applicationId),
  });
};

export const useGetApplicationsByUserId = (
  userId: number,
): UseQueryResult<Application[]> => {
  return useQuery<Application[], Error>({
    queryKey: ["getApplicationsByUserId", userId],
    queryFn: () => getApplicationsByUserId(userId),
    enabled: !!userId,
  });
};

export const useCreateApplication = (): UseMutationResult<
  Application,
  Error,
  { data: Omit<Application, "_id"> }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createApplication"],
    mutationFn: async ({ data }) => {
      return await createApplication(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getApplications"] });
      queryClient.invalidateQueries({
        queryKey: ["getApplicationWithAverage"],
      });
    },
    onError: (error: Error) => {},
  });
};

export const useUpdateApplication = (): UseMutationResult<
  Application,
  Error,
  { id: number; data: Partial<Application> }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateApplication"],
    mutationFn: async ({ id, data }) => {
      return await updateApplication(id, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["getApplications"] });
      queryClient.invalidateQueries({
        queryKey: ["getApplicationWithAverage"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getApplicationByIdWithScoresAndDetails"],
      });

      queryClient.invalidateQueries({ queryKey: ["getApplicationById"] });
    },
    onError: (error: Error) => {},
  });
};

export const useDeleteApplication = (): UseMutationResult<
  void,
  Error,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteApplication"],
    mutationFn: async (id: number) => {
      await deleteApplication(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getApplications"] });
      queryClient.invalidateQueries({
        queryKey: ["getApplicationWithAverage"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getApplicationByIdWithScoresAndDetails"],
      });
      queryClient.invalidateQueries({ queryKey: ["getApplicationById"] });
    },
    onError: (error: Error) => {},
  });
};

export const useSearchApplications = (
  query: string,
  options?: UseQueryOptions<Application[], Error>,
): UseQueryResult<Application[]> => {
  return useQuery<Application[], Error>({
    queryKey: ["searchApplications", query],
    queryFn: () => searchApplications(query),
  });
};

export const useGetRecruiterApplicationsStatisticsForChart = (
  recruiterId: number,
): UseQueryResult<{
  chartData: ChartDataPoint[];
  data: Application[];
  message?: string;
}> => {
  return useQuery<
    { chartData: ChartDataPoint[]; data: Application[]; message?: string },
    Error
  >({
    queryKey: ["getRecruiterApplicationsStatisticsForChart", recruiterId],
    queryFn: () => getRecruiterApplicationsStatisticsForChart(recruiterId),
    enabled: !!recruiterId,
  });
};
