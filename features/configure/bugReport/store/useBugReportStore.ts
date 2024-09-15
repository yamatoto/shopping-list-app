import { create } from 'zustand';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { ApiResponseBugReport } from '@/features/configure/bugReport/models/bugReportModel';

type BugReportStore = {
    resultOfFetchBugReports: QueryDocumentSnapshot<ApiResponseBugReport>[];
    setResultOfFetchBugReports: (
        bugReports: QueryDocumentSnapshot<ApiResponseBugReport>[],
    ) => void;
    refreshing: boolean;
    setRefreshing: (refreshing: boolean) => void;
};

export const useBugReportStore = create<BugReportStore>(set => ({
    resultOfFetchBugReports: [],
    setResultOfFetchBugReports: bugReports => {
        set({ resultOfFetchBugReports: bugReports });
    },
    refreshing: false,
    setRefreshing: (refreshing: boolean) => {
        set({ refreshing });
    },
}));
