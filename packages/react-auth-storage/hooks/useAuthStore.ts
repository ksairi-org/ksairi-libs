import type { AuthState } from "./types";

import { createJSONStorage, persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import { createZustandMmkvStorage } from "../utils/createZustandMmkvStorage";
import { supabase } from "@react-auth-client";

const SESSION_STORAGE_NAME = "auth-storage";

const INITIAL_TOKENS_STATE: Pick<AuthState, "accessToken"> = {
  accessToken: "",
};

const useAuthStore = createWithEqualityFn<AuthState>()(
  persist(
    (set, get) => ({
      ...INITIAL_TOKENS_STATE,
      setTokens: (tokens) => set({ ...tokens }),
      handleLogout: () => {
        const state = get();
        const keys = Object.keys(state) as (keyof AuthState)[];
        const wipedState = keys.reduce((acc, nextKey) => {
          // We want to wipe all tokens
          if (typeof state[nextKey] === "string") {
            // @ts-ignore
            acc[nextKey] = "";
          }

          return acc;
        }, {} as Partial<AuthState>);

        set(wipedState);
      },
      refreshSession: async () => {
        const {
          data: {
            session: { access_token: accessToken },
          },
          error: refreshSessionError,
        } = await supabase.auth.refreshSession();
        if (!refreshSessionError && accessToken) {
          // update the token in the store
          set({ accessToken: accessToken });
          return accessToken;
        } else {
          if (refreshSessionError) {
            throw refreshSessionError;
          } else {
            throw "No access_token returned when refreshing session";
          }
        }
      },
    }),
    {
      name: SESSION_STORAGE_NAME,
      storage: createJSONStorage(() => {
        return createZustandMmkvStorage({ id: SESSION_STORAGE_NAME });
      }),
    },
  ),
  shallow,
);

export { useAuthStore };
