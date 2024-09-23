import { Timestamp } from 'firebase/firestore';

export interface FeatureRequestBase {
    content: string;
    priority: PriorityValue;
    completed: boolean;
    rejected: boolean;
    rejectedReason: string;
    createdUser: string;
    updatedUser: string;
}

export interface ApiResponseFeatureRequest extends FeatureRequestBase {
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface DisplayFeatureRequest extends FeatureRequestBase {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export const PRIORITY = {
    NOT_SET: { value: 1, label: '未設定' },
    HIGH: { value: 2, label: '高' },
    MEDIUM: { value: 3, label: '中' },
    LOW: { value: 4, label: '低' },
} as const;
export type PriorityValue = (typeof PRIORITY)[keyof typeof PRIORITY]['value'];
export type PriorityLabel = (typeof PRIORITY)[keyof typeof PRIORITY]['label'];
export const PRIORITY_TO_LABEL: { [key in PriorityValue]: PriorityLabel } = {
    [PRIORITY.NOT_SET.value]: PRIORITY.NOT_SET.label,
    [PRIORITY.HIGH.value]: PRIORITY.HIGH.label,
    [PRIORITY.MEDIUM.value]: PRIORITY.MEDIUM.label,
    [PRIORITY.LOW.value]: PRIORITY.LOW.label,
} as const;
