import { useMemo } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { useFeatureRequestStore } from '@/features/configure/featureRequest/store/useFeatureRequestStore';
import {
    ApiResponseFeatureRequest,
    DisplayFeatureRequest,
} from '@/shared/models/requestModel';

export const useFeatureRequestQuery = () => {
    const { resultOfFetchFeatureRequests, refreshing } = useFeatureRequestStore(
        ({ resultOfFetchFeatureRequests, refreshing }) => ({
            resultOfFetchFeatureRequests,
            refreshing,
        }),
    );

    const convertToClientFeatureRequestFromServer = (
        fetchedFeatureRequest: QueryDocumentSnapshot<ApiResponseFeatureRequest>,
    ): DisplayFeatureRequest => {
        const data = fetchedFeatureRequest.data();
        return {
            ...data,
            id: fetchedFeatureRequest.id,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
        };
    };

    const featureRequestSections = useMemo(() => {
        const featureRequests = resultOfFetchFeatureRequests.map(
            fetchedFeatureRequest =>
                convertToClientFeatureRequestFromServer(fetchedFeatureRequest),
        );
        return [
            {
                title: '未完了',
                data: featureRequests.filter(
                    report => !report.completed && !report.rejected,
                ),
            },
            {
                title: '完了',
                data: featureRequests.filter(report => report.completed),
            },
            {
                title: '却下',
                data: featureRequests.filter(report => report.rejected),
            },
        ];
    }, [resultOfFetchFeatureRequests]);

    return {
        refreshing,
        featureRequestSections,
    };
};
