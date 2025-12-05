"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { bookingService } from "@/lib/services/bookingService";
import { Booking } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

export default function EditBookingPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [originalBooking, setOriginalBooking] = useState<Booking | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await bookingService.getBookingById(bookingId);
        if (!data) {
          alert("Бронювання не знайдено");
          router.push("/my-bookings");
          return;
        }
        setOriginalBooking(data);
        const year = data.startTime.getFullYear();
        const month = String(data.startTime.getMonth() + 1).padStart(2, '0');
        const day = String(data.startTime.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const startStr = data.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const endStr = data.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        setFormData({
          title: data.title,
          date: dateStr,
          startTime: startStr,
          endTime: endStr,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);
      
      const now = new Date();

      if (startDateTime < now) {
        throw new Error("Не можна перенести зустріч на минулий час!");
      }

      if (endDateTime <= startDateTime) {
        throw new Error("Час закінчення має бути пізніше початку");
      }

      if (!originalBooking) throw new Error("Дані бронювання втрачено. Оновіть сторінку.");

      await bookingService.updateBooking(bookingId, {
        title: formData.title,
        startTime: startDateTime,
        endTime: endDateTime,
        roomId: originalBooking.roomId 
      });

      router.push("/my-bookings");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Помилка оновлення");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Spinner /></div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Редагувати бронювання</h1>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <Input 
            label="Назва" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            required 
          />
          
          <Input 
            label="Дата" 
            type="date" 
            value={formData.date} 
            onChange={(e) => setFormData({...formData, date: e.target.value})} 
            required 
          />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Початок" type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} required />
            <Input label="Кінець" type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} required />
          </div>

          <div className="flex gap-2 mt-4">
            <Button type="button" variant="secondary" onClick={() => router.back()}>Скасувати</Button>
            <Button type="submit" isLoading={submitting}>Зберегти зміни</Button>
          </div>
        </form>
      </div>
    </div>
  );
}