import {
  getGetProfilesQueryKey,
  getProfiles,
  Profiles,
  usePostProfiles,
} from "@react-query-sdk";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryFilters } from "@utils";
import { useCallback, useState } from "react";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return undefined;
};

const useAddProfileIfNeeded = () => {
  const queryClient = useQueryClient();
  const [queryError, setQueryError] = useState();

  const { mutateAsync: addProfile, error: addProfileError } = usePostProfiles();

  const addProfileIfNeeded = useCallback(
    async (params: Profiles) => {
      try {
        const userProfileData = await queryClient.fetchQuery({
          queryKey: getGetProfilesQueryKey(),
          queryFn: () =>
            getProfiles(getQueryFilters({ user_id: params.user_id })),
        });
        if (Array.isArray(userProfileData) && !userProfileData?.length) {
          await addProfile({ data: params });
        }
      } catch (error) {
        setQueryError(error);
      }
    },
    [addProfile, queryClient],
  );

  return {
    addProfileIfNeeded,
    error: getErrorMessage(queryError || addProfileError),
  };
};

export { useAddProfileIfNeeded };
