export interface ScheduleItem {
  time: string;
  activity: string;
}

export type DifficultyLevel = "Easy" | "Moderate" | "Challenging";

export interface Activity {
  id: number;
  title: string;
  images: string[];
  shortInfo: string;
  details: string;
  fullDescription: string;

  duration: string;
  difficulty: DifficultyLevel;
  groupSize: string | number; // matches your dataset (some are numbers)
  price: number | string;     // some of your items used string, some number

  included: string[];
  notIncluded: string[];

  schedule: ScheduleItem[];

  location: string;
  bestTime: string;
  requirements: string[];
}

export interface BookingData {
  activityId: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  participants: number;
  specialRequirements?: string;
}
