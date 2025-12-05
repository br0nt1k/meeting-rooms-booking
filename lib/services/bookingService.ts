import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp,
  deleteDoc,
  doc,
  orderBy,
  updateDoc, 
  getDoc,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  DocumentData
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Booking } from "@/types";
import { checkTimeOverlap } from "@/lib/utils";

const COLLECTION_NAME = "bookings";
const convertDocToBooking = (doc: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>): Booking => {
  const data = doc.data();
  
  if (!data) {
    throw new Error("Document data is missing");
  }

  return {
    id: doc.id,
    roomId: data.roomId,
    roomName: data.roomName,
    userId: data.userId,
    userName: data.userName,
    title: data.title,
    startTime: (data.startTime as Timestamp).toDate(),
    endTime: (data.endTime as Timestamp).toDate(),
    participants: data.participants || [],
  };
};

export const bookingService = {
  getBookingsForRoom: async (roomId: string): Promise<Booking[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), where("roomId", "==", roomId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertDocToBooking);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  },
  getBookingById: async (id: string): Promise<Booking | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef); 
      
      if (docSnap.exists()) {
        return convertDocToBooking(docSnap);
      }
      return null;
    } catch (error) {
      console.error("Error fetching booking by ID:", error);
      throw error;
    }
  },
  createBooking: async (bookingData: Omit<Booking, "id">) => {
    try {
      const existingBookings = await bookingService.getBookingsForRoom(bookingData.roomId);
      
      const hasConflict = existingBookings.some(existing => 
        checkTimeOverlap(bookingData.startTime, bookingData.endTime, existing.startTime, existing.endTime)
      );

      if (hasConflict) throw new Error("Цей час вже зайнято!");

      await addDoc(collection(db, COLLECTION_NAME), {
        ...bookingData,
        createdAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  },
  updateBooking: async (bookingId: string, bookingData: Partial<Booking>) => {
    try {
      if (bookingData.startTime && bookingData.endTime && bookingData.roomId) {
        const existingBookings = await bookingService.getBookingsForRoom(bookingData.roomId);
        const otherBookings = existingBookings.filter(b => b.id !== bookingId);
        const hasConflict = otherBookings.some(existing => 
          checkTimeOverlap(bookingData.startTime!, bookingData.endTime!, existing.startTime, existing.endTime)
        );

        if (hasConflict) throw new Error("Новий час конфліктує з іншим бронюванням!");
      }

      await updateDoc(doc(db, COLLECTION_NAME, bookingId), bookingData);
    } catch (error) {
      throw error;
    }
  },
  getUserBookings: async (userId: string, userEmail: string | null, role: string): Promise<Booking[]> => {
    try {
      const bookingsMap = new Map<string, Booking>();

      if (role === 'admin') {
        const q = query(collection(db, COLLECTION_NAME), orderBy("startTime", "asc"));
        const snapshot = await getDocs(q);
        snapshot.docs.forEach(doc => bookingsMap.set(doc.id, convertDocToBooking(doc)));
      } else {
        const qOwner = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
        const snapshotOwner = await getDocs(qOwner);
        snapshotOwner.docs.forEach(doc => bookingsMap.set(doc.id, convertDocToBooking(doc)));
        if (userEmail) {
          const qParticipant = query(collection(db, COLLECTION_NAME), where("participants", "array-contains", userEmail));
          const snapshotParticipant = await getDocs(qParticipant);
          snapshotParticipant.docs.forEach(doc => bookingsMap.set(doc.id, convertDocToBooking(doc)));
        }
      }

      return Array.from(bookingsMap.values())
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    } catch (error) {
      console.error("Error fetching user bookings:", error);
      throw error;
    }
  },
  deleteBooking: async (bookingId: string) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  }
};