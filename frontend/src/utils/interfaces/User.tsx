import {Realm} from "@/utils/interfaces/Realm";

export interface User {
    id: number;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    realm: Realm;
    state: string;
    createdAt: string;
    updatedAt: string;
    password: string;
    __v: number;
    _id: string;
}