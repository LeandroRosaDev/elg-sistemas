"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setIsLoading(false);
      toast({
        title: "Erro no Login",
        description: res.error,
        variant: "destructive",
      });
    } else {
      setIsLoading(false);
      window.location.href = "/";
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm mb-4">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="mb-4"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="mb-6"
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logando..." : "Login"}
        </Button>
      </form>
      <div className="flex gap-2 justify-between w-full max-w-sm">
        <Link href="/cadastro">Cadastrar-se</Link>
        <Link href="/esqueci-senha">Esqueceu a senha?</Link>
      </div>
    </div>
  );
}
