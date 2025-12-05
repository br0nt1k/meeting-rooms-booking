import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc, 
  arrayUnion,
  Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Invitation {
  id: string;
  bookingId: string;
  senderName: string;
  receiverId: string;
  roomName: string;
  startTime: Date; 
  status: 'pending' | 'accepted' | 'declined';
}

export const invitationService = {
  createInvitation: async (data: Omit<Invitation, "id">) => {
    await addDoc(collection(db, "invitations"), data);
  },

  getMyInvitations: async (userId: string): Promise<Invitation[]> => {
    const q = query(
      collection(db, "invitations"), 
      where("receiverId", "==", userId),
      where("status", "==", "pending")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, 
            ...data,
            startTime: data.startTime instanceof Timestamp ? data.startTime.toDate() : data.startTime
        } as Invitation;
    });
  },
  acceptInvitation: async (invitationId: string, bookingId: string, userId: string) => {
    await updateDoc(doc(db, "invitations", invitationId), { status: 'accepted' });
    await updateDoc(doc(db, "bookings", bookingId), {
      participants: arrayUnion(userId) 
    });
  },

  declineInvitation: async (invitationId: string) => {
    await updateDoc(doc(db, "invitations", invitationId), { status: 'declined' });
  }
};