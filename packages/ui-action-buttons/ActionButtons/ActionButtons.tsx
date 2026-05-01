import type { ReactNode } from "react";

import { Containers } from "@ksairi-org/ui-containers";

type ActionButtonsProps = {
  primarySlot: ReactNode;
  secondarySlot?: ReactNode;
  tertiarySlot?: ReactNode;
  showTopBorder?: boolean;
};

const ActionButtons = ({
  primarySlot,
  secondarySlot,
  tertiarySlot,
  showTopBorder,
}: ActionButtonsProps) => (
  <Containers.SubY
    paddingVertical={"$2xl"}
    paddingRight={"$2xl"}
    paddingLeft={"$2xl"}
    alignItems={"center"}
    gap={"$2xl"}
    borderTopColor={showTopBorder ? "$border-brand" : undefined}
    borderTopWidth={showTopBorder ? 2 : undefined}
  >
    {primarySlot}
    {tertiarySlot}
    {secondarySlot}
  </Containers.SubY>
);

export { ActionButtons };
export type { ActionButtonsProps };
