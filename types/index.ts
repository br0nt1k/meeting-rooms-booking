export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'user'; 
}

export interface Room {
  id: string; 
  name: string;
  description: string;
  capacity: number; 
  amenities?: string[]; 
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;  
  userId: string;   
  userName: string;
  title: string;   
  startTime: Date;  
  endTime: Date;    
  participants: {
    email: string;
    role: 'admin' | 'guest'; 
  }[];
}