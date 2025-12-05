import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";
import { bookingService } from "@/lib/services/bookingService";
import { Booking } from "@/types";
import { toast, confirmAction } from "@/lib/toast";

export function useMyBookings() {
  const { user, isLoading: authLoading } = useUserStore();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    const fetchBookings = async () => {
      if (!user) return;
      try {
        const data = await bookingService.getUserBookings(
            user.uid, 
            user.email, 
            user.role || 'user'
        );
        setBookings(data);
      } catch (error) {
        console.error(error);
        toast.error("Не вдалося завантажити список");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBookings();
  }, [user, authLoading, router]);
  const handleCancel = (id: string) => {
    confirmAction("Ви дійсно хочете видалити це бронювання?", async () => {
        setCancelingId(id);
        try {
          await bookingService.deleteBooking(id);
          setBookings((prev) => prev.filter((b) => b.id !== id));
          toast.success("Бронювання успішно видалено");
        } catch (error) {
          console.error(error);
          toast.error("Не вдалося видалити");
        } finally {
          setCancelingId(null);
        }
    }, "Видалити?");
  };

  return {
    bookings,
    loading: loading || authLoading, 
    cancelingId,
    user, 
    handleCancel
  };
}