import type { NextPage } from "next";
import { z } from "zod";
import { FormData, useAutoForm } from "../lib/useAutoForm";
import { AutoForm } from "../lib/AutoForm";

const formSchema = {
  name: { label: "Nombre" },
  email: {
    component: "email",
    label: "Email",
    validator: z.string().email(),
    initialValue: "john@gmail",
  },
  password: {
    component: "password",
    label: "Password",
    validator: z.string().min(8),
  },
  custom: {
    component: "custom",
    label: "Custom",
    validator: z.string(),
    initialValue: "john",
    render: () => (
      <div>
        <textarea>Hola, esto tendria que registrarlo pero paja</textarea>
      </div>
    ),
  },
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

  const { controller } = useAutoForm(formSchema, {
    onSubmit,
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
