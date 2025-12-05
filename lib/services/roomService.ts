import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc,
  getDoc,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Room } from "@/types";

const COLLECTION_NAME = "rooms";

export const roomService = {
  createRoom: async (roomData: Omit<Room, "id">) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), roomData);
      return docRef.id;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  },
  getRooms: async (): Promise<Room[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("name"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Room[];
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw error;
    }
  },
  getRoomById: async (id: string): Promise<Room | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Room;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching room:", error);
      throw error;
    }
  },
  deleteRoom: async (id: string) => {
    try {
      const roomRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(roomRef);
    } catch (error) {
      console.error("Error deleting room:", error);
      throw error;
    }
  },
  updateRoom: async (id: string, data: Partial<Room>) => {
    try {
      const roomRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(roomRef, data);
    } catch (error) {
      console.error("Error updating room:", error);
      throw error;
    }
  }
};