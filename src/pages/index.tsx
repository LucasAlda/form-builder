import type { NextPage } from "next";
import { z } from "zod";
import { fieldHelper, FormData, useAutoForm } from "../lib/useAutoForm";
import { AutoForm } from "../lib/AutoForm";
import { TextInput, PasswordInput, Textarea } from "../lib/ExampleInput";

const formSchema = {
  nuevo: fieldHelper({
    validator: z.date(),
    label: "Nuevo",
    component: TextInput,
    initialValue: new Date(2000, 1, 1),
  }),
  name: fieldHelper({
    label: "Nombre",
    component: TextInput,
  }),
  email: fieldHelper({
    label: "Email",
    component: TextInput,
    validator: z.string().email(),
    initialValue: "jhon@gmail",
  }),
  cuit: fieldHelper({
    label: "CUIT",
    component: TextInput,
    validator: z.preprocess((val) => Number(val), z.number()),
  }),
  password: fieldHelper({
    label: "Password",
    component: PasswordInput,
    validator: z.string().min(8),
  }),
  custom: fieldHelper({
    label: "Custom",
    component: Textarea,
    validator: z.string().min(1),
    initialValue: "john",
  }),
} as const;

const Home: NextPage = () => {
  const onSubmit = async (data: FormData<typeof formSchema>) => {
    return new Promise((res) => {
      setTimeout(() => {
        // muchisimo codigo de mieda
        console.log(data); // aca esta tipado tambien!
        res(data);
      }, 2000);
    });
  };

  const { controller, form } = useAutoForm(formSchema, {
    onSubmit,
    initialValues: {
      custom: "Mucho texto",
    },
  });

  return (
    <div className="flex h-screen w-screen items-start justify-center bg-gray-100 pt-10">
      <button onClick={() => form.setValue("email", "nobody can see me")}>Cambiar un valor</button>
      <div className="rounded-lg bg-white p-6">
        <AutoForm controller={controller} />
      </div>
    </div>
  );
};

export default Home;
