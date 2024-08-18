import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface ServerResponseBase {
    createdAt: FirebaseFirestoreTypes.Timestamp;
    updatedAt: FirebaseFirestoreTypes.Timestamp;
}

export interface ServerCreateBase {
    createdAt: FirebaseFirestoreTypes.FieldValue;
    updatedAt: FirebaseFirestoreTypes.FieldValue;
}

export interface ClientDataBase {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
