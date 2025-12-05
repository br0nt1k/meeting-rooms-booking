"use client";

import Link from "next/link";
import { useMyBookings } from "@/hooks/useMyBookings"; 
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils"; 

export default function MyBookingsPage() {
  const { bookings, loading, cancelingId, user, handleCancel } = useMyBookings();

  if (loading) return <div className="flex justify-center p-20"><Spinner /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-black">
        {user?.role === 'admin' ? "Всі бронювання (Панель Адміна)" : "Мої бронювання"}
      </h1>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-lg mb-4">Список бронювань порожній</p>
          <Link href="/">
            <Button className="px-8">Знайти кімнату</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isPast = new Date() > booking.endTime;
            const isOrganizer = user?.uid === booking.userId;
            const canManage = isOrganizer || user?.role === 'admin';

            return (
              <div 
                key={booking.id}
                className={`
                  flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-xl border transition-all duration-300
                  ${isPast 
                    ? "bg-gray-50/80 border-gray-100 opacity-60 grayscale" 
                    : "bg-white/80 backdrop-blur-md border-white/60 shadow-sm hover:shadow-md"
                  }
                `}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{booking.title}</h3>
                    {user?.role === 'admin' && !isOrganizer && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md">
                            👤 {booking.userName}
                        </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 font-medium mb-1">{booking.roomName}</p>
                  
                  {user?.role !== 'admin' && (
                    <div className="mb-3">
                        {isOrganizer ? (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-md font-medium">Організатор</span>
                        ) : (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-md font-medium">Учасник</span>
                        )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                      📅 {formatDate(booking.startTime).split(",")[0]}
                    </span>
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                      ⏰ {booking.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {booking.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>

                {!isPast && canManage && (
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Link href={`/my-bookings/${booking.id}/edit`}>
                        <Button variant="secondary" className="h-9 text-sm">Змінити</Button>
                    </Link>

                    <Button 
                        variant="secondary" 
                        className="h-9 text-sm text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200"
                        onClick={() => handleCancel(booking.id)}
                        isLoading={cancelingId === booking.id}
                    >
                        {user?.role === 'admin' && !isOrganizer ? "Видалити" : "Скасувати"}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}