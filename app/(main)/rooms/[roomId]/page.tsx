"use client";

import { use } from "react";
import { useRoomBooking } from "@/hooks/useRoomBooking"; 
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

export default function RoomDetailsPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const {
    room,
    loading,
    submitting,
    bookingForm,
    participants,
    participantEmail,
    setParticipantEmail,
    handleChange,
    addParticipant,
    removeParticipant,
    handleBook
  } = useRoomBooking(roomId);

  if (loading) return <div className="flex justify-center p-10"><Spinner /></div>;
  if (!room) return <div className="text-center p-10">Кімнату не знайдено</div>;

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900">{room.name}</h1>
        <div className="inline-block bg-white/50 border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
          {room.capacity} місць
        </div>
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-2">Опис</h3>
          <p className="text-gray-600 leading-relaxed">{room.description}</p>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-lg h-fit">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Забронювати</h2>
        
        <form onSubmit={handleBook} className="flex flex-col gap-4">
          <Input label="Назва зустрічі" name="title" value={bookingForm.title} onChange={handleChange} required />
          <Input label="Дата" type="date" name="date" value={bookingForm.date} onChange={handleChange} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Початок" type="time" name="startTime" value={bookingForm.startTime} onChange={handleChange} required />
            <Input label="Кінець" type="time" name="endTime" value={bookingForm.endTime} onChange={handleChange} required />
          </div>
          <div className="border-t border-gray-200 pt-4 mt-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Додати учасників</label>
            <div className="flex gap-2 mb-3">
              <Input 
                label="" placeholder="email@колеги.com" 
                value={participantEmail} 
                onChange={(e) => setParticipantEmail(e.target.value)} 
              />
              <Button type="button" variant="secondary" onClick={addParticipant}>+</Button>
            </div>
            
            {participants.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {participants.map((email) => (
                  <li key={email} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md flex items-center gap-1 border border-blue-100">
                    {email}
                    <button type="button" onClick={() => removeParticipant(email)} className="hover:text-red-500 font-bold ml-1">×</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button type="submit" isLoading={submitting} className="mt-4 w-full" variant="dark">
            Підтвердити бронювання
          </Button>
        </form>
      </div>
    </div>
  );
}