import { useState, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

const useAppState = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [appPrevState, setAppPrevState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setAppPrevState(appState);
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    // Clean up the event listener when the component unmounts
    return () => {
      subscription.remove();
    };
  }, [appState]); // Re-run effect if appState changes

  return [appPrevState, appState];
};

export { useAppState };
