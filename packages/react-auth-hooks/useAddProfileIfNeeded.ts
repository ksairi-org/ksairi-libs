import {
  getGetProfilesQueryKey,
  getProfiles,
  Profiles,
  usePostProfiles,
} from "@ksairi-org/react-query-sdk";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

const getQueryFilters = (fieldFilters: Record<string, unknown>) => {
  const validEntries = Object.entries(fieldFilters).filter(
    (entry): entry is [string, NonNullable<string | number>] => {
      const [, value] = entry;
      return value !== null && value !== undefined;
    },
  );
  return validEntries.length > 0
    ? Object.fromEntries(validEntries.map(([key, value]) => [key, `eq.${value}`]))
    : undefined;
};

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
