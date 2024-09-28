import { useCallback, useEffect } from 'react';

import { useToast } from '@/shared/helpers/toast';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import { FeatureRequestsRepository } from '@/features/configure/featureRequest/api/featureRequestsRepository';
import { useFeatureRequestStore } from '@/features/configure/featureRequest/store/useFeatureRequestStore';
import {
    DisplayFeatureRequest,
    FEATURE_REQUEST_PRIORITY_TO_LABEL,
    FeatureRequestPriorityValue,
} from '@/shared/models/requestModel';

export const useFeatureRequestUsecase = () => {
    const { showToast } = useToast();
    const featureRequestsRepository = new FeatureRequestsRepository();
    const { setResultOfFetchFeatureRequests, setRefreshing } =
        useFeatureRequestStore();
    const { currentUser } = useFirebaseAuth();

    const fetchAllFeatureRequests = useCallback(async () => {
        try {
            const featureRequests = await featureRequestsRepository.fetchAll();
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
            priorityValue: FeatureRequestPriorityValue,
        ) => {
            const createdUser = currentUser!.displayName;
            try {
                await featureRequestsRepository.add(
                    {
                        content: newFeatureRequestContent,
                        priority: priorityValue,
                        completed: false,
                        rejected: false,
                        rejectedReason: '',
                        createdUser,
                        updatedUser: createdUser,
                    },
                    `実装要望「${newFeatureRequestContent}」を追加しました。\n優先度:${FEATURE_REQUEST_PRIORITY_TO_LABEL[priorityValue]}`,
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
                await featureRequestsRepository.update(
                    {
                        id,
                        completed,
                        rejected: false,
                        updatedUser: currentUser!.displayName,
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
                await featureRequestsRepository.update(
                    {
                        id,
                        completed: false,
                        rejected: true,
                        rejectedReason,
                        updatedUser: currentUser!.displayName,
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
                        return `${keyLabels[key]}: ${FEATURE_REQUEST_PRIORITY_TO_LABEL[beforeFeatureRequest[key]]} → ${FEATURE_REQUEST_PRIORITY_TO_LABEL[updateFeatureRequest[key]!]}`;
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
                await featureRequestsRepository.update(
                    {
                        ...beforeFeatureRequest,
                        ...updateFeatureRequest,
                        updatedUser: currentUser!.displayName,
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
        const unsubscribe = featureRequestsRepository.setupUpdateListener(
            ({ message, updatedUser }) => {
                if (message) {
                    showToast(`${updatedUser}${message}`);
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
