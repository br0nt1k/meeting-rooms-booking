"use client";

import { use } from "react";
import { useEditRoom } from "@/hooks/useEditRoom"; 
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useRouter } from "next/navigation"; 

export default function EditRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const router = useRouter(); 
  const { 
    formData, 
    setFormData, 
    loading, 
    saving, 
    handleUpdate, 
    handleDelete 
  } = useEditRoom(roomId);

  if (loading) return <div className="flex justify-center mt-20"><Spinner /></div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Редагувати кімнату</h1>
        <Button 
            type="button" 
            variant="secondary" 
            onClick={handleDelete}
            className="text-red-600 border-red-200 hover:bg-red-50"
        >
            Видалити кімнату
        </Button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <Input
            label="Назва кімнати"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Опис</label>
            <textarea
              name="description"
              rows={3}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <Input
            label="Місткість"
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
            required
          />

          <div className="flex gap-3 mt-4">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Скасувати
            </Button>
            <Button type="submit" isLoading={saving}>
              Зберегти зміни
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}