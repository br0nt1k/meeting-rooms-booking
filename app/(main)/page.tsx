"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Room } from "@/types";
import { roomService } from "@/lib/services/roomService";
import { Button } from "@/components/ui/Button";
import { RoomCard } from "@/components/features/rooms/RoomCard";
import { Spinner } from "@/components/ui/Spinner";
import { useUserStore } from "@/lib/store"; 

export default function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore(); 

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomService.getRooms();
        setRooms(data);
      } catch (error) {
        console.error("Помилка завантаження кімнат:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Бронювання кімнат</h1>
          <p className="text-gray-500 mt-1">Оберіть кімнату для вашої зустрічі</p>
        </div>
        {user?.role === 'admin' && (
          <Link href="/rooms/new">
            <Button>+ Додати кімнату</Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="w-10 h-10 border-4 border-gray-200 border-t-black" />
        </div>
      ) : rooms.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center">
          <p className="text-gray-500 mb-4">Кімнат поки немає.</p>
          {user?.role === 'admin' && (
             <Link href="/rooms/new">
               <Button variant="secondary">Створити першу</Button>
             </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}