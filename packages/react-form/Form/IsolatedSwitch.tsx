import type {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";

import { useCallback } from "react";

import { Switch } from "tamagui";

/**
 *
 * @param props IsolatedSwitchProps
 * @param props.methods UseFormReturn<LoginFormSchema>
 * @param props.path Path<LoginFormSchema>
 * @returns Switch component that is isolated from the rest of the form
 */
const IsolatedSwitch = <
  FormSchema extends FieldValues,
  FieldName extends Path<FormSchema>,
  Value extends PathValue<FormSchema, FieldName>,
>({
  methods,
  path,
}: {
  methods: UseFormReturn<FormSchema>;
  path: FieldName;
}) => {
  const handleOnCheckedChange = useCallback(
    (isChecked: boolean) => {
      methods.setValue(path, isChecked as Value, {
        shouldValidate: true,
        shouldTouch: true,
        shouldDirty: true,
      });
    },
    [methods, path],
  );

  const hasAcceptedTerms = methods.watch(path);

  return (
    <Switch
      checked={hasAcceptedTerms}
      onCheckedChange={handleOnCheckedChange}
      borderColor={"$background-warning"}
      backgroundColor={hasAcceptedTerms ? "$background-action" : undefined}
    >
      <Switch.Thumb
        alignSelf={"center"}
        backgroundColor={"$background-error"}
        //animation={'bouncy'}
      />
    </Switch>
  );
};

export { IsolatedSwitch };
