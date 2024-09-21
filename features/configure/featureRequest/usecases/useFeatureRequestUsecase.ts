import { useCallback, useEffect } from 'react';

import { showToast } from '@/shared/helpers/toast';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import * as FeatureRequestsRepository from '@/features/configure/featureRequest/api/featureRequestsRepository';
import { useFeatureRequestStore } from '@/features/configure/featureRequest/store/useFeatureRequestStore';
import {
    DisplayFeatureRequest,
    PRIORITY_TO_LABEL,
    PriorityValue,
} from '@/features/configure/featureRequest/models/featureRequestModel';
import { setupFeatureRequestListener } from '@/features/configure/featureRequest/api/featureRequestsRepository';

export const useFeatureRequestUsecase = () => {
    const { setResultOfFetchFeatureRequests, setRefreshing } =
        useFeatureRequestStore();
    const { currentUser } = useFirebaseAuth();

    const fetchAllFeatureRequests = useCallback(async () => {
        try {
            const featureRequests =
                await FeatureRequestsRepository.fetchAllFeatureRequests();
            setResultOfFetchFeatureRequests(featureRequests);
        } catch (error: any) {
            console.error(error);
            showToast('実装要望リストの取得に失敗しました。');
        }
    }, [currentUser]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchAllFeatureRequests();
        setRefreshing(false);
    }, [fetchAllFeatureRequests]);

    const initialize = useCallback(async () => {
        await fetchAllFeatureRequests();
    }, []);

    const handleAddFeatureRequest = useCallback(
        async (
            newFeatureRequestContent: string,
            priorityValue: PriorityValue,
        ) => {
            const createdUser = currentUser!.displayName;
            try {
                await FeatureRequestsRepository.addFeatureRequest(
                    {
                        content: newFeatureRequestContent,
                        priority: priorityValue,
                        completed: false,
                        rejected: false,
                        rejectedReason: '',
                        requesterName: createdUser,
                        updatedUserName: createdUser,
                    },
                    `実装要望「${newFeatureRequestContent}」を追加しました。\n優先度:${PRIORITY_TO_LABEL[priorityValue]}`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(`実装要望の追加に失敗しました。`);
                return;
            }

            await fetchAllFeatureRequests();
        },
        [currentUser, fetchAllFeatureRequests],
    );

    const handleCompleteFeatureRequestCheckToggle = useCallback(
        async ({ id, content, completed }: DisplayFeatureRequest) => {
            try {
                await FeatureRequestsRepository.updateFeatureRequest(
                    {
                        id,
                        completed,
                        rejected: false,
                        updatedUserName: currentUser!.displayName,
                    },
                    `実装要望の「${content}」を${completed ? '修正' : '未'}完了にしました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(`実装要望の完了・未完了処理に失敗しました。`);
                return;
            }

            await fetchAllFeatureRequests();
        },
        [currentUser, fetchAllFeatureRequests],
    );

    const handleRejectFeatureRequest = useCallback(
        async ({ id, content, rejectedReason }: DisplayFeatureRequest) => {
            try {
                await FeatureRequestsRepository.updateFeatureRequest(
                    {
                        id,
                        completed: false,
                        rejected: true,
                        rejectedReason,
                        updatedUserName: currentUser!.displayName,
                    },
                    `実装要望の「${content}」を却下しました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(`実装要望の却下に失敗しました。`);
                return;
            }

            await fetchAllFeatureRequests();
        },
        [currentUser, fetchAllFeatureRequests],
    );

    const keyLabels: Partial<Record<keyof DisplayFeatureRequest, string>> = {
        content: '内容',
        priority: '優先度',
        rejectedReason: '却下理由',
    };
    const getChangedContent = useCallback(
        (
            beforeFeatureRequest: DisplayFeatureRequest,
            updateFeatureRequest: Partial<DisplayFeatureRequest>,
        ) => {
            return (
                Object.keys(updateFeatureRequest) as Array<
                    keyof DisplayFeatureRequest
                >
            )
                .filter(
                    key =>
                        updateFeatureRequest[key] !== beforeFeatureRequest[key],
                )
                .map(key => {
                    if (key === 'priority') {
                        return `${keyLabels[key]}: ${PRIORITY_TO_LABEL[beforeFeatureRequest[key]]} → ${PRIORITY_TO_LABEL[updateFeatureRequest[key]!]}`;
                    }
                    return `${keyLabels[key]}: ${beforeFeatureRequest[key]} → ${updateFeatureRequest[key]}`;
                })
                .join('\n');
        },
        [],
    );

    const handleUpdateFeatureRequest = useCallback(
        async (
            beforeFeatureRequest: DisplayFeatureRequest,
            updateFeatureRequest: Partial<DisplayFeatureRequest>,
        ) => {
            const changedContent = getChangedContent(
                beforeFeatureRequest,
                updateFeatureRequest,
            );
            if (!changedContent) return;

            try {
                await FeatureRequestsRepository.updateFeatureRequest(
                    {
                        ...beforeFeatureRequest,
                        ...updateFeatureRequest,
                        updatedUserName: currentUser!.displayName,
                    },
                    `実装要望の「${beforeFeatureRequest.content}」を更新しました。\n${changedContent}`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(`実装要望の更新に失敗しました。`);
            }

            await fetchAllFeatureRequests();
        },
        [currentUser, fetchAllFeatureRequests],
    );

    useEffect(() => {
        const unsubscribe = setupFeatureRequestListener(
            ({ message, updatedUserName }) => {
                if (message) {
                    showToast(`${updatedUserName}${message}`);
                }

                fetchAllFeatureRequests().then();
            },
        );
        return () => unsubscribe();
    }, [fetchAllFeatureRequests]);

    return {
        initialize,
        handleAddFeatureRequest,
        handleRefresh,
        handleCompleteFeatureRequestCheckToggle,
        handleRejectFeatureRequest,
        handleUpdateFeatureRequest,
    };
};
