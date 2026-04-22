import { useCallback, useState } from "react";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { supabase } from "@react-auth-client";

type SignUpData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

type Status = "idle" | "loading" | "error" | "success";

const isDuplicateError = (message: string) =>
  message.includes("The email address is already in use by another account");

/**
 * @returns function to be used to sign up
 */
const useSignUpWithPersistence = () => {
  const [status, setStatus] = useState<Status>("idle");

  const handleSignUp = useCallback(
    async (data: SignUpWithPasswordCredentials) => {
      try {
        setStatus("loading");
        const {
          data: { user },
          error,
        } = await supabase.auth.signUp(data);
        if (error) {
          throw error;
        }

        const newUser = {
          id: user.id,
          email: user.email,
          firstName: user.user_metadata["firstName"],
          lastName: user.user_metadata["lastName"],
        };
        setStatus("success");
        return newUser;
      } catch (e) {
        console.error(e);
        setStatus("error");
        throw new Error(
          isDuplicateError(e.message)
            ? "Email already taken. Please use another one"
            : e,
        );
      }
    },
    [],
  );

  return { handleSignUp, status };
};

export type { SignUpData };
export { useSignUpWithPersistence };
