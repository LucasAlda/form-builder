import { zodResolver } from "@hookform/resolvers/zod";
import { NamedExoticComponent } from "react";
import { DeepPartial, useForm } from "react-hook-form";
import { z } from "zod";
import { InputProps } from "./ExampleInput";

type FieldSchema = {
  label: string;
  component: NamedExoticComponent<InputProps> | ((props: InputProps) => JSX.Element);
  validator?: z.ZodType;
  initialValue?: string | number | boolean | Date;
};

type SafeFieldSchema<T extends z.ZodType> = Omit<FieldSchema, "validator" | "initialValues"> & {
  validator: T;
  initialValue?: z.infer<T>;
};

export const fieldHelper = <T>(field: T extends z.ZodType ? SafeFieldSchema<T> : FieldSchema) => field;

export type FormSchema = {
  [key: string]: FieldSchema;
};

type ZodSchema<TSchema> = {
  [B in keyof TSchema]: TSchema[B] extends FormSchema[string]
    ? TSchema[B]["validator"] extends z.ZodType
      ? TSchema[B]["validator"]
      : z.ZodOptional<z.ZodString>
    : z.ZodOptional<z.ZodString>;
};

export type FormData<TSchema> = { [K in keyof ZodSchema<TSchema>]: z.infer<ZodSchema<TSchema>[K]> };

export type InitialValues<TSchema> = { [K in keyof FormData<TSchema>]?: FormData<TSchema>[K] };

const generateZodSchema = <T extends FormSchema>(
  form: T
): z.ZodObject<ZodSchema<T>, "strip", z.ZodTypeAny, FormData<T>, FormData<T>> => {
  const schemaObject = {} as ZodSchema<T>;
  (Object.entries(form) as Entries<FormData<T>>).forEach(([name, field]) => {
    schemaObject[name] = field.validator ?? z.string().optional();
  });

  return z.object(schemaObject);
};

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

const generateInitialValues = <TSchema extends FormSchema>(
  form: TSchema,
  initialValues?: InitialValues<TSchema>
) => {
  if (!initialValues) initialValues = {};
  const init = initialValues ?? {};

  (Object.entries(form) as Entries<typeof form>).forEach(([name, field]) => {
    if (!init[name]) init[name] = (field.initialValue as InitialValues<TSchema>[typeof name]) ?? undefined;
  });

  return init;
};

export const useAutoForm = <T extends FormSchema>(
  formSchema: T,
  {
    onSubmit,
    initialValues,
  }: {
    onSubmit: (data: FormData<T>) => Promise<unknown>;
    initialValues?: InitialValues<T>;
  }
) => {
  const schema = generateZodSchema(formSchema);
  const generatedInitialValues = generateInitialValues(formSchema, initialValues);

  const form = useForm<FormData<T>>({
    resolver: zodResolver(schema),
    defaultValues: generatedInitialValues as DeepPartial<FormData<T>>,
  });

  const items = { form, onSubmit: form.handleSubmit(onSubmit), formSchema };
  return { ...items, controller: items };
};
