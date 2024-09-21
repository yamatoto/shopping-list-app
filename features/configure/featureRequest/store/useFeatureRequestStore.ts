import { create } from 'zustand';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { ApiResponseFeatureRequest } from '@/features/configure/featureRequest/models/featureRequestModel';

type FeatureRequestStore = {
    resultOfFetchFeatureRequests: QueryDocumentSnapshot<ApiResponseFeatureRequest>[];
    setResultOfFetchFeatureRequests: (
        featureRequests: QueryDocumentSnapshot<ApiResponseFeatureRequest>[],
    ) => void;
    refreshing: boolean;
    setRefreshing: (refreshing: boolean) => void;
};

export const useFeatureRequestStore = create<FeatureRequestStore>(set => ({
    resultOfFetchFeatureRequests: [],
    setResultOfFetchFeatureRequests: featureRequests => {
        set({ resultOfFetchFeatureRequests: featureRequests });
    },
    refreshing: false,
    setRefreshing: (refreshing: boolean) => {
        set({ refreshing });
    },
}));
