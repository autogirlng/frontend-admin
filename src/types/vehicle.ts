import { ReactNode } from "react";

export interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mainImage: string;
  gallery: string[];
  perks: { icon: ReactNode; text: string }[];
  features: string[];
  dailyRates: { label: string; price: string }[];
  discounts: { label: string; discount: string }[];
  airportFee: string;
  outskirts: string[];
}
