import { Offer } from "./offer";
import { User } from "./user";

export type Application = {
    id: number;
    content: string;
    firstname: string;
    lastname: string;
    email: string;
    offer_id: number;
    offer?: Offer;
    user_id: number;
    user?: User;
    cv: string;
    createdAt?: Date;
    updatedAt?: Date;

}