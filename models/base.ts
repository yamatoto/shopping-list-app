import { Timestamp, FieldValue } from 'firebase/firestore';

export interface ServerResponseBase {
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface ServerCreateBase {
    createdAt: FieldValue;
    updatedAt: FieldValue;
}

export interface ClientDataBase {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
