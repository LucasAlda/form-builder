import type { NextPage } from "next";
import { z } from "zod";
import { FormData, useAutoForm } from "../lib/useAutoForm";
import { AutoForm } from "../lib/AutoForm";
import { TextInput, PasswordInput, Textarea } from "../lib/ExampleInput";

const formSchema = {
  name: { label: "Nombre", component: TextInput },
  email: {
    label: "Email",
    component: TextInput,
    validator: z.string().email(),
    initialValue: "john@gmail",
  },
  cuit: {
    label: "CUIT",
    component: TextInput,
    validator: z.preprocess((val) => Number(val), z.number()),
  },
  password: {
    label: "Password",
    component: PasswordInput,
    validator: z.string().min(8),
  },
  custom: {
    label: "Custom",
    component: Textarea,
    validator: z.string().min(1),
    initialValue: "john",
  },
} as const;

const Home: NextPage = () => {
  const onSubmit = async (data: FormData<typeof formSchema>) => {
    return new Promise((res) => {
      setTimeout(() => {
        // muchisimo codigo de mieda
        console.log(data.cuit); // aca esta tipado tambien!
        res(data);
      }, 2000);
    });
  };

  const { controller } = useAutoForm(formSchema, {
    onSubmit,
    initialValues: {
      custom: "Mucho texto",
    },
  });

  return (
    <div className="flex h-screen w-screen items-start justify-center bg-gray-100 pt-10">
      <div className="rounded-lg bg-white p-6">
        <AutoForm controller={controller} />
      </div>
    </div>
  );
};

export default Home;
