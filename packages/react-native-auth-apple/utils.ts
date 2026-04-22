import { Platform } from "react-native";

import {
  appleAuth,
  appleAuthAndroid,
} from "@invertase/react-native-apple-authentication";

/**
 * A type guard for whether the given `error` is an object with a `code` property.
 * @param error - The error to check.
 * @returns Whether the given `error` is an object with a `code` property.
 */
const isErrorWithCode = (error: unknown): error is Error & { code: string } =>
  typeof error === "object" && error !== null && "code" in error;

const isAppleAuthSupported =
  Platform.OS === "ios"
    ? appleAuth.isSupported
    : Platform.OS === "android"
      ? appleAuthAndroid.isSupported
      : false;

const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

export { isErrorWithCode, isAppleAuthSupported, decodeJWT };
