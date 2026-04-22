import { useBackHandler } from "@react-native-community/hooks";
import { useNavigation } from "expo-router";

/**
 * disable back handler on focus
 */
const useDisableBackHandlerOnFocus = () => {
  const isFocused = useNavigation().isFocused();

  // if this screen is focused, override Android's back handler
  // by returning `true`, it tells the Android system that the back handler IS being overridden, and not to proceed with the default back handling behavior
  useBackHandler(() => isFocused);
};

export { useDisableBackHandlerOnFocus };
