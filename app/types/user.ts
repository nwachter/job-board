import { Application } from "./application";
import { Offer } from "./offer";
import { Skill } from "./skill";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  RECRUITER = "RECRUITER",
  // GUEST = "guest",
}

export type User = {
  id: number;
  username: string;
  email: string;
  role: Role;
  avatar: string;
  password: string;
  applications?: Application[];
  offers?: Offer[];
  skills?: Skill[];
  createdAt?: Date;
  updatedAt?: Date;
};
