import { Application } from "./application";
import { Offer } from "./offer";

export type User = {
    id: number;
    username: string;
    email: string;
    role: string;
    avatar: string;
    password: string;
    applications?: Application[];
    offers?: Offer[];
    createdAt?: Date;
    updatedAt?: Date;
}