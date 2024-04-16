import {
  FetchMetadataRequest,
  FetchMetadataResponse,
} from "@/pages/api/fetchMetadata";
import { JsonValue } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useMetadata<T = JsonValue>(uri?: string) {
  const { data, isLoading, isSuccess, error } = useQuery<T, Error>({
    queryKey: [uri || ""],
    queryFn: () => {
      if (!uri) return Promise.resolve("");

      const request: FetchMetadataRequest = {
        url: uri,
      };
      return axios
        .post("/api/fetchMetadata", request)
        .then((response) => response.data as FetchMetadataResponse)
        .then((response) => response.content)
        .then(JSON.parse);
    },
    retry: true,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: true,
    staleTime: Infinity,
  });

  return {
    data,
    isLoading,
    isSuccess,
    error,
  };
}
