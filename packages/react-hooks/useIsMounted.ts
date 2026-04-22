import { useEffect, useRef } from 'react';

/**
 * @returns if component is mounted
 */
const useIsMounted = () => {
  const isMounted = useRef(true);

  // simply sets the ref's value to false in useEffect's cleanup function
  useEffect(
    () => () => {
      isMounted.current = false;
    },
    [],
  );

  return isMounted;
};

export { useIsMounted };
