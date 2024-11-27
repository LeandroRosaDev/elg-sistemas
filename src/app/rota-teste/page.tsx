"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";

export default function Page() {
  const formSchema = z.object({
    arquivo: z
      .any()
      .refine((file) => file?.size <= 5000000, "O arquivo é maior que 5MB"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  // const onsubmit = form.handleSubmit(async (input) => {
  //   const formData = new FormData();
  //   formData.append("arquivo", input.arquivo);

  //   const file: File | null = formData.get("arquivo") as unknown as File;

  //   const buffer = await file.arrayBuffer();

  //   const flag = new Buffer.from(buffer).toString("base64");

  //   console.log(flag);
  // });

  return (
    <div>
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="arquivo"
            render={({ field: { onChange, ...fieldProps } }) => (
              <FormItem className="mt-4">
                <FormLabel>Nome de usuário</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome de usuário"
                    type="file"
                    accept="image/png"
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                    {...fieldProps}
                  />
                </FormControl>
                <FormDescription>Teste aqui</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Enviando" : "Cadastrar"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
