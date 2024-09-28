import { Timestamp } from 'firebase/firestore';

export interface RequestBase<
    T extends FeatureRequestPriorityValue | BugReportPriorityValue,
> {
    content: string;
    priority: T;
    completed: boolean;
    rejected: boolean;
    rejectedReason: string;
    createdUser: string;
    updatedUser: string;
}
export interface FeatureRequest
    extends RequestBase<FeatureRequestPriorityValue> {}
export interface BugReport extends RequestBase<BugReportPriorityValue> {}

export interface ApiResponseRequest<
    T extends FeatureRequestPriorityValue | BugReportPriorityValue,
> extends RequestBase<T> {
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
export type ApiResponseFeatureRequest =
    ApiResponseRequest<FeatureRequestPriorityValue>;
export type ApiResponseBugReport = ApiResponseRequest<BugReportPriorityValue>;

export interface DisplayRequest<
    T extends FeatureRequestPriorityValue | BugReportPriorityValue,
> extends RequestBase<T> {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
export type DisplayFeatureRequest = DisplayRequest<FeatureRequestPriorityValue>;
export type DisplayBugReport = DisplayRequest<BugReportPriorityValue>;

export type PriorityItem<
    T extends FeatureRequestPriorityValue | BugReportPriorityValue,
> = { value: T; label: string };

export const FEATURE_REQUEST_PRIORITY = {
    NOT_SET: { value: 1, label: '未設定' },
    HIGH: { value: 2, label: '高' },
    MEDIUM: { value: 3, label: '中' },
    LOW: { value: 4, label: '低' },
} as const;

export type FeatureRequestPriorityValue =
    (typeof FEATURE_REQUEST_PRIORITY)[keyof typeof FEATURE_REQUEST_PRIORITY]['value'];
export type FeatureRequestPriorityLabel =
    (typeof FEATURE_REQUEST_PRIORITY)[keyof typeof FEATURE_REQUEST_PRIORITY]['label'];

export const FEATURE_REQUEST_PRIORITY_TO_LABEL: {
    [key in FeatureRequestPriorityValue]: FeatureRequestPriorityLabel;
} = {
    [FEATURE_REQUEST_PRIORITY.NOT_SET.value]:
        FEATURE_REQUEST_PRIORITY.NOT_SET.label,
    [FEATURE_REQUEST_PRIORITY.HIGH.value]: FEATURE_REQUEST_PRIORITY.HIGH.label,
    [FEATURE_REQUEST_PRIORITY.MEDIUM.value]:
        FEATURE_REQUEST_PRIORITY.MEDIUM.label,
    [FEATURE_REQUEST_PRIORITY.LOW.value]: FEATURE_REQUEST_PRIORITY.LOW.label,
} as const;

export const BUF_REPORT_PRIORITY = {
    NOT_SET: { value: 1, label: '未設定' },
    CRITICAL: { value: 2, label: '致命的' },
    HIGH: { value: 3, label: '高' },
    MEDIUM: { value: 4, label: '中' },
    LOW: { value: 5, label: '低' },
} as const;

export type BugReportPriorityValue =
    (typeof BUF_REPORT_PRIORITY)[keyof typeof BUF_REPORT_PRIORITY]['value'];
export type BugReportPriorityLabel =
    (typeof BUF_REPORT_PRIORITY)[keyof typeof BUF_REPORT_PRIORITY]['label'];

export const BUF_REPORT_PRIORITY_TO_LABEL: {
    [key in BugReportPriorityValue]: BugReportPriorityLabel;
} = {
    [BUF_REPORT_PRIORITY.NOT_SET.value]: BUF_REPORT_PRIORITY.NOT_SET.label,
    [BUF_REPORT_PRIORITY.CRITICAL.value]: BUF_REPORT_PRIORITY.CRITICAL.label,
    [BUF_REPORT_PRIORITY.HIGH.value]: BUF_REPORT_PRIORITY.HIGH.label,
    [BUF_REPORT_PRIORITY.MEDIUM.value]: BUF_REPORT_PRIORITY.MEDIUM.label,
    [BUF_REPORT_PRIORITY.LOW.value]: BUF_REPORT_PRIORITY.LOW.label,
} as const;
