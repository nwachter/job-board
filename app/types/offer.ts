import { Application } from "./application";
import { User } from "./user";

export type Offer = {
    id: number;
    title: string;
    description: string;
    company_name: string;
    location: string;
    salary: number;
    admin_id: number;
    admin?: User;
    applications?: Application[];
    createdAt?: Date;
    updatedAt?: Date;
}