import {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  searchSkills,
} from "../services/skills";

import { Skill } from "@/app/types/skill";
import {
  UseQueryResult,
  useQuery,
  UseMutationResult,
  useQueryClient,
  useMutation,
  UseQueryOptions,
} from "@tanstack/react-query";

export const useGetSkills = (): UseQueryResult<Skill[]> => {
  return useQuery<Skill[]>({
    queryKey: ["getSkills"],
    queryFn: async () => {
      return await getSkills();
    },
  });
};

export const useGetSkillById = (skillId: number): UseQueryResult<Skill> => {
  return useQuery<Skill>({
    queryKey: ["getSkillById", skillId],
    queryFn: () => getSkillById(skillId),
  });
};

export const useCreateSkill = (): UseMutationResult<
  Skill,
  Error,
  { data: Omit<Skill, "id"> }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createSkill"],
    mutationFn: async ({ data }) => {
      return await createSkill(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getSkills"] });
      queryClient.invalidateQueries({ queryKey: ["getSkillWithAverage"] });
    },
    onError: (error: Error) => {},
  });
};

export const useUpdateSkill = (): UseMutationResult<
  Skill,
  Error,
  { id: number; data: Partial<Skill> }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateSkill"],
    mutationFn: async ({ id, data }) => {
      return await updateSkill(id, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["getSkills"] });
      queryClient.invalidateQueries({ queryKey: ["getSkillWithAverage"] });
      queryClient.invalidateQueries({
        queryKey: ["getSkillByIdWithScoresAndDetails"],
      });

      queryClient.invalidateQueries({ queryKey: ["getSkillById"] });
    },
    onError: (error: Error) => {},
  });
};

export const useDeleteSkill = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteSkill"],
    mutationFn: async (id: number) => {
      await deleteSkill(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getSkills"] });
      queryClient.invalidateQueries({ queryKey: ["getSkillWithAverage"] });
      queryClient.invalidateQueries({
        queryKey: ["getSkillByIdWithScoresAndDetails"],
      });
      queryClient.invalidateQueries({ queryKey: ["getSkillById"] });
    },
    onError: (error: Error) => {},
  });
};

export const useSearchSkills = (
  query: string,
  options?: UseQueryOptions<Skill[], Error>,
): UseQueryResult<Skill[]> => {
  return useQuery<Skill[], Error>({
    queryKey: ["searchSkills", query],
    queryFn: () => searchSkills(query),
  });
};
