import { FormProvider } from "react-hook-form";
import { FormSchema, useAutoForm } from "./useAutoForm";

export const AutoForm = <T extends FormSchema>({
  controller,
}: {
  controller: ReturnType<typeof useAutoForm<T>>["controller"];
}) => {
  return (
    <FormProvider {...controller.form}>
      <form onSubmit={controller.onSubmit}>
        <fieldset disabled={controller.form.formState.isSubmitting}>
          {Object.entries(controller.formSchema).map(([name, input]) => {
            const Component = input.component;
            return <Component key={name} label={input.label ?? ""} name={name} />;
          })}
          <button className="rounded-md border-0 bg-blue-500 px-4 py-2 text-white" type="submit">
            {controller.form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </fieldset>
      </form>
    </FormProvider>
  );
};
