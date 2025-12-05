import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { roomService } from "@/lib/services/roomService";
import { toast, confirmAction } from "@/lib/toast";

export function useEditRoom(roomId: string) {
  const router = useRouter(); 

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const room = await roomService.getRoomById(roomId);
        if (room) {
          setFormData({
            name: room.name,
            description: room.description,
            capacity: room.capacity.toString(),
          });
        } else {
            toast.error("Кімнату не знайдено");
            router.push("/");
        }
      } catch (error) {
        console.error("Помилка:", error);
        toast.error("Помилка при завантаженні кімнати");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoom();
  }, [roomId, router]);
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await roomService.updateRoom(roomId, {
        name: formData.name,
        description: formData.description,
        capacity: Number(formData.capacity),
      });
      
      toast.success("Кімнату успішно оновлено!");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Помилка при оновленні кімнати");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = () => {
    confirmAction(
        "Це безповоротно видалить кімнату та історію її бронювань.", 
        async () => {
            try {
                await roomService.deleteRoom(roomId);
                toast.success("Кімнату видалено");
                router.push("/");
            } catch (error) {
                console.error(error);
                toast.error("Не вдалося видалити кімнату");
            }
        }, 
        "Видалити кімнату?"
    );
  };
  return {
    formData,
    setFormData,
    loading,
    saving,
    handleUpdate,
    handleDelete
  };
}