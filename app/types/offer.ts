import { Application } from "./application";
import { Location } from "./location";
import { User } from "./user";

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
    applications?: Application[];
    createdAt?: Date;
    updatedAt?: Date;
}