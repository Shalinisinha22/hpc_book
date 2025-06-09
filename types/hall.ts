export interface Hall {
  _id?: string;
  hall_name: string;
  max_capacity: number;
  short_intro: string;
  desc?: string;
  length: number;
  breadth: number;
  height: number;
  area: number;
  guest_entry_point?: string;
  phone?: string;
  email?: string;
  seating: {
    theatre: number;
    ushaped: number;
    boardroom: number;
    classroom: number;
    reception: number;
  };
  hall_image: Array<{
    name: string;
    url: string;
    ext: string;
  }>;
  status: 'available' | 'unavailable' | 'maintenance';
  cdate?: Date;
}