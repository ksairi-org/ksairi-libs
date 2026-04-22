type AuthTokens = {
  accessToken: string;
};

type AuthFunctions = {
  setTokens: (tokens: AuthTokens) => void;
  refreshSession: () => Promise<string | undefined>;
  handleLogout: () => void;
};

type AuthState = AuthFunctions & AuthTokens;

export type { AuthState, AuthTokens };
