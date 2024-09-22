import { Timestamp } from 'firebase/firestore';

export interface BugReportBase {
    content: string;
    priority: PriorityValue;
    completed: boolean;
    rejected: boolean;
    rejectedReason: string;
    createdUser: string;
    updatedUser: string;
}

export interface ApiResponseBugReport extends BugReportBase {
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface DisplayBugReport extends BugReportBase {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export const PRIORITY = {
    CRITICAL: { value: 1, label: '致命的' },
    HIGH: { value: 2, label: '高' },
    MEDIUM: { value: 3, label: '中' },
    LOW: { value: 4, label: '低' },
} as const;
export type PriorityValue = (typeof PRIORITY)[keyof typeof PRIORITY]['value'];
export type PriorityLabel = (typeof PRIORITY)[keyof typeof PRIORITY]['label'];
export const PRIORITY_TO_LABEL: { [key in PriorityValue]: PriorityLabel } = {
    [PRIORITY.CRITICAL.value]: PRIORITY.CRITICAL.label,
    [PRIORITY.HIGH.value]: PRIORITY.HIGH.label,
    [PRIORITY.MEDIUM.value]: PRIORITY.MEDIUM.label,
    [PRIORITY.LOW.value]: PRIORITY.LOW.label,
} as const;
