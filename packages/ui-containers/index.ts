import { Screen } from "./screen-container";
import { SubX, SubY } from "./screen-sub-containers";
import {
  ScreenYGlassContainer,
  ScreenXGlassContainer,
} from "./screen-glass-container";
import { SubGlassX, SubGlassY } from "./screen-sub-glass-containers";

const Containers = {
  Screen,
  ScreenXGlassContainer,
  ScreenYGlassContainer,
  SubX,
  SubY,
  SubGlassX,
  SubGlassY,
} as const;

type ContainersType = typeof Containers;
type ContainerName = keyof ContainersType;

type ContainersProps = {
  [key in ContainerName]: Parameters<ContainersType[key]>[0];
};

export { Containers };
export type { ContainersProps };
