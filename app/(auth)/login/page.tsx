"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/lib/services/authService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.login(formData);
      router.push("/");
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        if (err.message.includes("invalid-credential")) {
          setError("Невірний email або пароль");
        } else {
          setError(err.message);
        }
      } else {
        setError("Виникла невідома помилка");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">З поверненням!</h1>
        <p className="text-gray-500 text-sm mt-2">Увійдіть, щоб керувати бронюваннями</p>
      </div>
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" type="email" name="email"  placeholder="oleg@example.com"  value={formData.email}  onChange={handleChange} required/>
        <Input  label="Пароль"  type="password" name="password" placeholder="••••••••"  value={formData.password} onChange={handleChange} required/>
        <Button type="submit" isLoading={loading} className="mt-2"> Увійти  </Button>
      </form>

      <div className="text-center text-sm text-gray-500"> Немає акаунту?{" "}
        <Link href="/register" className="text-blue-600 hover:underline font-medium"> Зареєструватися </Link>
      </div>
    </div>
  );
}