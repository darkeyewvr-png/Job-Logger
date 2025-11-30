export interface Job {
  id: string;
  clientName: string;
  address: string;
  materials: string;
  description: string;
  timestamp: Date;
  timeIn: string;
  timeOut: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}