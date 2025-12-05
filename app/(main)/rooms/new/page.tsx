"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { roomService } from "@/lib/services/roomService";
import { useUserStore } from "@/lib/store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "@/lib/toast"; 

export const dynamic = 'force-dynamic';

export default function NewRoomPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useUserStore();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user || user.role !== 'admin') {
        toast.error("Доступ заборонено! Тільки адміністратори.");
        router.push("/");
      }
    }
  }, [user, isAuthLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await roomService.createRoom({
        name: formData.name,
        description: formData.description,
        capacity: Number(formData.capacity),
        amenities: [],
      });

      toast.success("Кімнату успішно створено!");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Не вдалося створити кімнату. Спробуйте ще раз.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuthLoading || !user || user.role !== 'admin') {
    return <div className="flex justify-center items-center min-h-[50vh]"><Spinner /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Додати нову кімнату</h1>

      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Назва кімнати"
            name="name"
            placeholder="Наприклад: Велика переговорна"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Опис</label>
            <textarea
              name="description"
              rows={3}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none"
              placeholder="Опишіть обладнання (проектор, дошка, кондиціонер...)"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Місткість (кількість людей)"
            type="number"
            name="capacity"
            placeholder="10"
            value={formData.capacity}
            onChange={handleChange}
            required
            min={1}
          />

          <div className="flex gap-3 mt-4 pt-2 border-t border-gray-100">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => router.back()}
              className="w-full sm:w-auto"
            >
              Скасувати
            </Button>
            <Button 
              type="submit" 
              isLoading={submitting} 
              className="w-full sm:w-auto"
            >
              Створити кімнату
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}