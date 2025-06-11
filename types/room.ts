interface Room {
  _id: string;
  room_title: string;
  desc: string;
  max_person: number;
  max_children: number;
  totalRooms: number;
  roomSize: number;
  pricePerNight: number; // Add this line
  roomImage: Array<{
    url: string;
    name: string;
    ext: string;
  }>;
  roomView: 'City View' | 'Garden View' | 'Pool View' | 'Ocean View' | 'Mountain View';
  bedType: 'Single' | 'Double' | 'Queen' | 'King' | 'Twin';
  amenities: string[];
  additionalDetails: string[];
  status: 'available' | 'unavailable';
  cdate: string;
}