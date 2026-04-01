import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Home,
  Memory,
  Question,
  Theme,
  UserProfile,
  Video,
} from "../backend";
import { useActor } from "./useActor";

const QUERY_DEFAULTS = {
  staleTime: 0,
  refetchOnMount: true,
  refetchOnWindowFocus: true,
} as const;

// --- Theme ---
export function useGetTheme() {
  const { actor, isFetching } = useActor();
  return useQuery<Theme>({
    queryKey: ["theme"],
    queryFn: async () => {
      if (!actor)
        return {
          primaryColor: "",
          accentColor: "",
          backgroundColor: "",
          fontStyle: "",
        };
      return actor.getTheme();
    },
    enabled: !!actor && !isFetching,
    ...QUERY_DEFAULTS,
  });
}

export function useSaveTheme() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (theme: Theme) => {
      if (!actor) throw new Error("No actor");
      return actor.saveTheme(theme);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theme"] });
    },
  });
}

// --- Home ---
export function useGetHome() {
  const { actor, isFetching } = useActor();
  return useQuery<Home>({
    queryKey: ["home"],
    queryFn: async () => {
      if (!actor) return { title: "", subtitle: "", heroImageId: "" };
      return actor.getHome();
    },
    enabled: !!actor && !isFetching,
    ...QUERY_DEFAULTS,
  });
}

export function useSaveHome() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (home: Home) => {
      if (!actor) throw new Error("No actor");
      return actor.saveHome(home);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home"] });
    },
  });
}

// --- Memories ---
export function useGetMemories() {
  const { actor, isFetching } = useActor();
  return useQuery<Memory[]>({
    queryKey: ["memories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMemories();
    },
    enabled: !!actor && !isFetching,
    ...QUERY_DEFAULTS,
  });
}

export function useAddMemory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (memory: Memory) => {
      if (!actor) throw new Error("No actor");
      return actor.addMemory(memory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
    },
  });
}

export function useUpdateMemory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (memory: Memory) => {
      if (!actor) throw new Error("No actor");
      return actor.updateMemory(memory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
    },
  });
}

export function useDeleteMemory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteMemory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
    },
  });
}

// --- Questions ---
export function useGetQuestions() {
  const { actor, isFetching } = useActor();
  return useQuery<Question[]>({
    queryKey: ["questions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuestions();
    },
    enabled: !!actor && !isFetching,
    ...QUERY_DEFAULTS,
  });
}

export function useAddQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (q: Question) => {
      if (!actor) throw new Error("No actor");
      return actor.addQuestion(q);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useUpdateQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (q: Question) => {
      if (!actor) throw new Error("No actor");
      return actor.updateQuestion(q);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useDeleteQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteQuestion(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

// --- Videos ---
export function useGetVideos() {
  const { actor, isFetching } = useActor();
  return useQuery<Video[]>({
    queryKey: ["videos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVideos();
    },
    enabled: !!actor && !isFetching,
    ...QUERY_DEFAULTS,
  });
}

export function useAddVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (video: Video) => {
      if (!actor) throw new Error("No actor");
      return actor.addVideo(video);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

export function useUpdateVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (video: Video) => {
      if (!actor) throw new Error("No actor");
      return actor.updateVideo(video);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

export function useDeleteVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteVideo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

// --- Users ---
export function useGetUserProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, UserProfile]>>({
    queryKey: ["userProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      const profiles = await actor.getUserProfiles();
      return profiles.map(
        ([p, profile]) => [p.toString(), profile] as [string, UserProfile],
      );
    },
    enabled: !!actor && !isFetching,
    ...QUERY_DEFAULTS,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    ...QUERY_DEFAULTS,
  });
}

export function useAdminAddUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      principalText,
      profile,
    }: { principalText: string; profile: UserProfile }) => {
      if (!actor) throw new Error("No actor");
      const { Principal } = await import("@dfinity/principal");
      const principal = Principal.fromText(principalText);
      return actor.adminAddUserProfile(principal, profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfiles"] });
    },
  });
}

export function useAdminUpdateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      principalText,
      profile,
    }: { principalText: string; profile: UserProfile }) => {
      if (!actor) throw new Error("No actor");
      const { Principal } = await import("@dfinity/principal");
      const principal = Principal.fromText(principalText);
      return actor.adminUpdateUserProfile(principal, profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfiles"] });
    },
  });
}

export function useAdminDeleteUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (principalText: string) => {
      if (!actor) throw new Error("No actor");
      const { Principal } = await import("@dfinity/principal");
      const principal = Principal.fromText(principalText);
      return actor.adminDeleteUserProfile(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfiles"] });
    },
  });
}
