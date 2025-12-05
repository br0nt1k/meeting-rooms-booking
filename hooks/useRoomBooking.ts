import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { roomService } from "@/lib/services/roomService";
import { bookingService } from "@/lib/services/bookingService";
import { Room } from "@/types";
import { toast } from "@/lib/toast";
import { useUserStore } from "@/lib/store";

export function useRoomBooking(roomId: string) {
  const router = useRouter();
  const { user } = useUserStore();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    title: "",
  });

  const [participantEmail, setParticipantEmail] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await roomService.getRoomById(roomId);
        if (data) {
          setRoom(data);
        } else {
          toast.error("Кімнату не знайдено");
          router.push("/");
        }
      } catch (err) {
        console.error(err);
        toast.error("Помилка при завантаженні");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId, router]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const addParticipant = () => {
    if (!participantEmail) return;
    if (!participantEmail.includes("@")) {
      toast.warning("Введіть коректний email");
      return;
    }
    if (participants.includes(participantEmail)) {
      toast.warning("Цей учасник вже доданий");
      return;
    }
    setParticipants([...participants, participantEmail]);
    setParticipantEmail("");
  };

  const removeParticipant = (email: string) => {
    setParticipants(participants.filter(p => p !== email));
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!user) {
      toast.error("Увійдіть, щоб забронювати кімнату");
      setSubmitting(false);
      return;
    }

    try {
      const startDateTime = new Date(`${bookingForm.date}T${bookingForm.startTime}`);
      const endDateTime = new Date(`${bookingForm.date}T${bookingForm.endTime}`);
      const now = new Date();

      if (startDateTime < now) throw new Error("Не можна бронювати час у минулому!");
      if (endDateTime <= startDateTime) throw new Error("Час закінчення має бути пізніше початку");

      await bookingService.createBooking({
        roomId: roomId,
        roomName: room?.name || "Unknown",
        userId: user.uid,
        userName: user.displayName || user.email || "User",
        title: bookingForm.title,
        startTime: startDateTime,
        endTime: endDateTime,
        participants: participants,
      });

      toast.success("Успішно заброньовано!");
      
      setBookingForm({ date: "", startTime: "", endTime: "", title: "" });
      setParticipants([]);
      
    } catch (err) { 
      console.error(err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Помилка бронювання");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
  };
}