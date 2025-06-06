import { Offer } from "./offer";

export type Location = {
  id: number;
  country: string;
  city: string;
  offers?: Offer[];
  createdAt?: Date;
  updatedAt?: Date;
};
