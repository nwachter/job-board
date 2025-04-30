import { Application } from "./application";
import { Location } from "./location";
import { User } from "./user";
import { Skill } from "./skill";

export type Offer = {
  id: number;
  title: string;
  description: string;
  company_name: string;
  location_id: number;
  location?: Location;
  salary: number;
  contract_type: string;
  recruiter_id: number;
  recruiter?: User;
  createdAt?: Date;
  updatedAt?: Date;
  skills?: Skill[];
  applications?: Application[];
};
