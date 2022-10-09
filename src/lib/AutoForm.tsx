import { FormProvider } from "react-hook-form";
import { Input } from "./ExampleInput";
import { useAutoForm } from "./useAutoForm";

export const AutoForm = ({ controller }: { controller: ReturnType<typeof useAutoForm>["controller"] }) => {
  return (
    <FormProvider {...controller.form}>
      <form onSubmit={controller.onSubmit}>
        <fieldset disabled={controller.form.formState.isSubmitting}>
          {Object.entries(controller.formSchema).map(([name, input]) => (
            <Input
              key={name}
              label={input.label ?? ""}
              type={input.component ?? "text"}
              {...controller.form.register(name)}
            />
          ))}
          <button className="rounded-md border-0 bg-blue-500 px-4 py-2 text-white" type="submit">
            {controller.form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </fieldset>
      </form>
    </FormProvider>
  );
};
