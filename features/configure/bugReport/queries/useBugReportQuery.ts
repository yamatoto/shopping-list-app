import { useMemo } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { useBugReportStore } from '@/features/configure/bugReport/store/useBugReportStore';
import {
    ApiResponseBugReport,
    DisplayBugReport,
} from '@/features/configure/bugReport/models/bugReportModel';

export const useBugReportQuery = () => {
    const { resultOfFetchBugReports, refreshing } = useBugReportStore(
        ({ resultOfFetchBugReports, refreshing }) => ({
            resultOfFetchBugReports,
            refreshing,
        }),
    );

    const convertToClientBugReportFromServer = (
        fetchedBugReport: QueryDocumentSnapshot<ApiResponseBugReport>,
    ): DisplayBugReport => {
        const data = fetchedBugReport.data();
        return {
            ...data,
            id: fetchedBugReport.id,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
        };
    };

    const bugReports = useMemo(
        () =>
            resultOfFetchBugReports.map(fetchedBugReport =>
                convertToClientBugReportFromServer(fetchedBugReport),
            ),
        [resultOfFetchBugReports],
    );

    return {
        bugReports,
        refreshing,
    };
};
