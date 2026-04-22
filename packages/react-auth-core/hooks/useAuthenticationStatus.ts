import { useAuthStore } from "@react-auth-storage";

/**
 * @returns The authentication status of the user
 */
const useAuthenticationStatus = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (accessToken) {
    return "logged in";
  }

  return "logged out";
};

export { useAuthenticationStatus };
