import { Application } from "./application";

export type User = {
    id: number;
    username: string;
    email: string;
    role: string;
    password: string;
    applications?: Application[];
    createdAt?: Date;
    updatedAt?: Date;
}