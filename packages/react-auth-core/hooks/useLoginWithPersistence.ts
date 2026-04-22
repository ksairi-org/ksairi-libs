import {
  AuthTokenResponse,
  SignInWithIdTokenCredentials,
  SignInWithPasswordCredentials,
} from "@supabase/supabase-js";

import { useCallback, useEffect, useState } from "react";

import { useAuthStore } from "@react-auth-storage";
import { supabase } from "@react-auth-client";
import { useAddProfileIfNeeded } from "@react-auth-hooks";

type Status = "idle" | "loading" | "error" | "success";

/**
 * @returns functions to be used to login either with username or email or social networks.
 */
const useLoginWithPersistence = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const [status, setStatus] = useState<Status>("idle");
  const [loginWithSocialError, setLoginWithSocialError] = useState<string>();
  const { addProfileIfNeeded, error: addProfileError } =
    useAddProfileIfNeeded();

  useEffect(() => {
    setLoginWithSocialError(addProfileError);
  }, [addProfileError]);

  const setLoggedUserData = useCallback(
    (data: AuthTokenResponse["data"]) => {
      setTokens({
        accessToken: data.session.access_token,
      });
    },
    [setTokens],
  );

  const handleLogInSocialNetwork = useCallback(
    async (credentials: SignInWithIdTokenCredentials) => {
      try {
        setStatus("loading");
        const { data, error } =
          await supabase.auth.signInWithIdToken(credentials);
        if (error) {
          throw error;
        }
        setLoggedUserData(data);
        await addProfileIfNeeded({ user_id: data.user.id });
        setStatus("success");
        return data.user;
      } catch (error) {
        console.error("Login failed with social", error);
        setStatus("error");
        setLoginWithSocialError(error);
      }
    },
    [addProfileIfNeeded, setLoggedUserData],
  );

  const handleLogInWithEmail = useCallback(
    async (credentials: SignInWithPasswordCredentials) => {
      try {
        setStatus("loading");
        const { data, error } =
          await supabase.auth.signInWithPassword(credentials);
        if (error) {
          throw error;
        }
        setLoggedUserData(data);
        await addProfileIfNeeded({ user_id: data.user.id });
        setStatus("success");
        return data.user;
      } catch (error) {
        console.error("Login failed with email:", error);
        setStatus("error");
        throw error;
      }
    },
    [addProfileIfNeeded, setLoggedUserData],
  );

  return {
    handleLogInWithEmail,
    handleLogInSocialNetwork,
    status,
    loginWithSocialError,
  };
};

export { useLoginWithPersistence };
