import { Offer } from "./offer";
import { User } from "./user";

export type Skill = {
  id: number;
  name: string;
  level: number;
  users?: User[];
  offers?: Offer[];
  createdAt?: Date;
  updatedAt?: Date;
};
