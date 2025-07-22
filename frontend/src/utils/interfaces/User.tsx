import {Realm} from "@/utils/interfaces/Realm";

export interface UserRole {
    ADMIN: "admin",
    USER: "user"
}

export interface User {
    id: number;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    realm: Realm;
    role: UserRole;
    state: string;
    createdAt: string;
    updatedAt: string;
    password: string;
    __v: number;
    _id: string;
}