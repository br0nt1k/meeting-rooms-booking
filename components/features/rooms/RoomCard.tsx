"use client";

import Link from "next/link";
import { Room } from "@/types";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/lib/store";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const { user } = useUserStore();

  return (
    <div className="group bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl p-5 flex flex-col h-full">
      <div>
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="text-lg font-bold text-gray-600 line-clamp-2 leading-tight group-hover:text-gray-900 transition-colors">
            {room.name}
          </h3>
          <span className="shrink-0 bg-white/50 backdrop-blur-sm text-gray-700 text-xs font-bold px-3 py-1 rounded-full border border-gray-200 shadow-sm">
            {room.capacity} місць
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-6 line-clamp-3">
          {room.description}
        </p>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-200/50 grid grid-cols-2 gap-3">
        {user?.role === 'admin' ? (
          <Link href={`/rooms/${room.id}/edit`} className="w-full">
            <Button variant="secondary" className="w-full text-sm">
              Редагувати
            </Button>
          </Link>
        ) : (
          <div className="hidden"></div> 
        )}
        
        <Link href={`/rooms/${room.id}`} className={user?.role === 'admin' ? "w-full" : "col-span-2"}>
           <Button variant="dark" className="w-full text-sm">
             Бронювати
           </Button>
        </Link>
      </div>
    </div>
  );
}