import type { FormProps, RequiredSchema } from "./types";
import type { Path } from "react-hook-form";

import { Children, createElement } from "react";

import { Controller } from "react-hook-form";

import { useCheckForProperFormUsage } from "./hooks";
import { getNextInputName, isReactElementWithProps } from "./utils";

/**
 * @param props FormProps<Schema>
 * @param props.methods UseFormReturn<Schema>
 * @param props.children ReactElement | ReactElement[]
 * @param props.loggingMode A setting for when helpful logging messages should be displayed in the console @default 'only first render'
 * @param props.shouldAutoFocusNextRegisteredInput @default true [React Native only] Should the Form automatically try to set `onSubmitEditing` of the auto-registered that follows a given input.
 * Note that the `nextInputToFocus` prop passed into a component created by `createHandledFormElement` will override this setting.
 * @returns Fragment of `children` injected with react-hook-form methods
 */
const Form = <Schema extends RequiredSchema>({
  methods,
  children,
  loggingMode = "only first render",
  shouldAutoFocusNextRegisteredInput = true,
}: FormProps<Schema>) => {
  useCheckForProperFormUsage(children, methods, loggingMode);

  const childrenToBeRegistered = Children.toArray(children)
    .filter(isReactElementWithProps)
    .map((child) => child.props.name);

  return (
    <>
      {Children.map(children, (child) => {
        // Type guard check
        if (!isReactElementWithProps(child)) {
          return child;
        }

        const currentChildName = child.props.name;

        if (!currentChildName) {
          return child;
        }

        const nextInputName = getNextInputName(
          childrenToBeRegistered,
          currentChildName,
        ) as Path<Schema>;

        // React Native only for automatically focusing the next registered input
        const onSubmitEditing = (data?: unknown) => {
          if (child.props?.onSubmitEditing) {
            child.props.onSubmitEditing(data);
          }
        };

        // React Native only
        // If there is a returnKeyType passed via props, apply it
        // Otherwise, set to `next` if there is a next input to focus
        const returnKeyType =
          child.props.returnKeyType ??
          (!nextInputName || !shouldAutoFocusNextRegisteredInput
            ? undefined
            : "next");

        const errormessage =
          methods.formState.errors[child.props.name]?.message;
        const defaultValue =
          methods.formState.defaultValues?.[child.props.name];

        return (
          <Controller
            control={methods.control}
            name={currentChildName}
            render={({ field: { name, onBlur, onChange, ...rest } }) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const handleOnBlur = (e: any) => {
                child.props?.onBlur?.(e);

                onBlur();
              };

              const reactNativeProps = {
                onSubmitEditing,
                onChangeText: onChange,
                returnKeyType,
              };

              return createElement(child.type, {
                ...child.props,
                ...reactNativeProps,
                onBlur: handleOnBlur,
                onChange,
                errormessage,
                defaultValue,
                ...rest,
                disabled: child.props.disabled ?? rest.disabled,
              });
            }}
          />
        );
      })}
    </>
  );
};

export { Form };
