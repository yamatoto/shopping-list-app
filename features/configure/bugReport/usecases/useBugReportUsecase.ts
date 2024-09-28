import { useCallback, useEffect } from 'react';

import { useToast } from '@/shared/helpers/toast';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import { BugReportsRepository } from '@/features/configure/bugReport/api/bugReportsRepository';
import { useBugReportStore } from '@/features/configure/bugReport/store/useBugReportStore';
import {
    BUF_REPORT_PRIORITY_TO_LABEL,
    BugReportPriorityValue,
    DisplayBugReport,
} from '@/shared/models/requestModel';

export const useBugReportUsecase = () => {
    const { showToast } = useToast();
    const bugReportsRepository = new BugReportsRepository();
    const { setResultOfFetchBugReports, setRefreshing } = useBugReportStore();
    const { currentUser } = useFirebaseAuth();

    const fetchAllBugReports = useCallback(async () => {
        try {
            const bugReports = await bugReportsRepository.fetchAll();
            setResultOfFetchBugReports(bugReports);
        } catch (error: any) {
            console.error(error);
            showToast('バグ報告リストの取得に失敗しました。');
        }
    }, [currentUser]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchAllBugReports();
        setRefreshing(false);
    }, [fetchAllBugReports]);

    const initialize = useCallback(async () => {
        await fetchAllBugReports();
    }, []);

    const handleAddBugReport = useCallback(
        async (
            newBugReportContent: string,
            priorityValue: BugReportPriorityValue,
        ) => {
            const createdUser = currentUser!.displayName;
            try {
                await bugReportsRepository.add(
                    {
                        content: newBugReportContent,
                        priority: priorityValue,
                        completed: false,
                        rejected: false,
                        rejectedReason: '',
                        createdUser,
                        updatedUser: createdUser,
                    },
                    `バグ報告「${newBugReportContent}」を追加しました。\n重要度:${BUF_REPORT_PRIORITY_TO_LABEL[priorityValue]}`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(`バグ報告の追加に失敗しました。`);
                return;
            }

            await fetchAllBugReports();
        },
        [currentUser, fetchAllBugReports],
    );

    const handleCompleteBugReportCheckToggle = useCallback(
        async ({ id, content, completed }: DisplayBugReport) => {
            try {
                await bugReportsRepository.update(
                    {
                        id,
                        completed,
                        rejected: false,
                        updatedUser: currentUser!.displayName,
                    },
                    `バグ報告の「${content}」を${completed ? '修正' : '未'}完了にしました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(`バグ報告の完了・未完了処理に失敗しました。`);
                return;
            }

            await fetchAllBugReports();
        },
        [currentUser, fetchAllBugReports],
    );

    const handleRejectBugReport = useCallback(
        async ({ id, content, rejectedReason }: DisplayBugReport) => {
            try {
                await bugReportsRepository.update(
                    {
                        id,
                        completed: false,
                        rejected: true,
                        rejectedReason,
                        updatedUser: currentUser!.displayName,
                    },
                    `バグ報告の「${content}」を却下しました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(`バグ報告の却下に失敗しました。`);
                return;
            }

            await fetchAllBugReports();
        },
        [currentUser, fetchAllBugReports],
    );

    const keyLabels: Partial<Record<keyof DisplayBugReport, string>> = {
        content: '内容',
        priority: '重要度',
        rejectedReason: '却下理由',
    };
    const getChangedContent = useCallback(
        (
            beforeBugReport: DisplayBugReport,
            updateBugReport: Partial<DisplayBugReport>,
        ) => {
            return (
                Object.keys(updateBugReport) as Array<keyof DisplayBugReport>
            )
                .filter(key => updateBugReport[key] !== beforeBugReport[key])
                .map(key => {
                    if (key === 'priority') {
                        return `${keyLabels[key]}: ${BUF_REPORT_PRIORITY_TO_LABEL[beforeBugReport[key]]} → ${BUF_REPORT_PRIORITY_TO_LABEL[updateBugReport[key]!]}`;
                    }
                    return `${keyLabels[key]}: ${beforeBugReport[key]} → ${updateBugReport[key]}`;
                })
                .join('\n');
        },
        [],
    );

    const handleUpdateBugReport = useCallback(
        async (
            beforeBugReport: DisplayBugReport,
            updateBugReport: Partial<DisplayBugReport>,
        ) => {
            const changedContent = getChangedContent(
                beforeBugReport,
                updateBugReport,
            );
            if (!changedContent) return;

            try {
                await bugReportsRepository.update(
                    {
                        ...beforeBugReport,
                        ...updateBugReport,
                        updatedUser: currentUser!.displayName,
                    },
                    `バグ報告の「${beforeBugReport.content}」を更新しました。\n${changedContent}`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(`バグ報告の更新に失敗しました。`);
            }

            await fetchAllBugReports();
        },
        [currentUser, fetchAllBugReports],
    );

    useEffect(() => {
        const unsubscribe = bugReportsRepository.setupUpdateListener(
            ({ message, updatedUser }) => {
                if (message) {
                    showToast(`${updatedUser}${message}`);
                }

                fetchAllBugReports().then();
            },
        );
        return () => unsubscribe();
    }, [fetchAllBugReports]);

    return {
        initialize,
        handleAddBugReport,
        handleRefresh,
        handleCompleteBugReportCheckToggle,
        handleRejectBugReport,
        handleUpdateBugReport,
    };
};
