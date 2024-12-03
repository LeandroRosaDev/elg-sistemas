"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import logoEmpresa from "@/profile-masc.webp";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

function CadastrarRotinasPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "O nome deve ter pelo menos 2 caracteres.",
    }),
    email: z
      .string()
      .email("O email deve ser válido")
      .nonempty("Email é obrigatório"),
    gender: z.enum(["Masculino", "Feminino", "Indefinido"], {
      errorMap: () => ({ message: "Selecione um gênero válido" }),
    }),
    password: z.string().min(6, {
      message: "A senha deve ter pelo menos 6 caracteres.",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onsubmit = form.handleSubmit(async (input) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("email", input.email);
    formData.append("gender", input.gender);
    formData.append("password", input.password);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Cadastro realizado com sucesso!",
          variant: "default",
        });
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao cadastrar usuário.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="text-gray-700 m-6 mr-12">
      <Card className=" text-gray-700 p-4 font-medium dark:text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Adicionando Colaborador</CardTitle>
        </CardHeader>
        <CardContent className="bg-gray-50 rounded-md dark:bg-black p-8">
          <div className="flex flex-col justify-around ">
            <Form {...form}>
              <form onSubmit={onsubmit} className="  grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                        <FormLabel>Nome de usuário</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome de usuário" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input placeholder="E-mail" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                        <FormLabel>Gênero</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o gênero" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Masculino">
                                Masculino
                              </SelectItem>
                              <SelectItem value="Feminino">Feminino</SelectItem>
                              <SelectItem value="Indefinido">
                                Prefiro não definir
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Senha"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="CPF"
                    render={({ field }) => (
                      <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input placeholder="CPF" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                        <FormLabel>Área de Atuação</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Masculino">
                                Climatização
                              </SelectItem>
                              <SelectItem value="Feminino">Solar</SelectItem>
                              <SelectItem value="Indefinido">
                                Elétrica
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                        <FormLabel>Função Técnica</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Masculino">Técnico</SelectItem>
                              <SelectItem value="Feminino">
                                Auxiliar Técnico
                              </SelectItem>
                              <SelectItem value="Indefinido">
                                Engenheiro
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="data"
                    render={({ field }) => (
                      <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                        <FormLabel>Data de Nascimento</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Data de Nascimento"
                            type="date"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col justify-center w-full max-w-sm items-center gap-4">
                  <p>Adicionar Imagem de perfil</p>

                  <Image
                    width={200}
                    height={200}
                    alt="Logo Empresa"
                    src={logoEmpresa}
                  />
                  <Input className="w-32" type="file" />
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2 flex-wrap mt-4">
            <Button
              variant="outline"
              type="submit"
              className="mt-4 w-full"
              disabled={isLoading}
            >
              <Save size={16} className="mr-1" />
              {isLoading ? "Cadastrando..." : "Cadastrar Colaborador"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default CadastrarRotinasPage;
