import { BaseRepository } from '@/shared/api/baseRepository';
import {
    ApiResponseFeatureRequest,
    FeatureRequestBase,
} from '@/features/configure/featureRequest/models/featureRequestModel';

export class FeatureRequestsRepository extends BaseRepository<
    ApiResponseFeatureRequest,
    FeatureRequestBase
> {
    constructor() {
        super('feature-requests', '実装要望');
    }

    protected getOrderByFields(): {
        field: string;
        direction: 'asc' | 'desc';
    }[] {
        return [
            { field: 'priority', direction: 'asc' },
            { field: 'updatedAt', direction: 'desc' },
        ];
    }
}
