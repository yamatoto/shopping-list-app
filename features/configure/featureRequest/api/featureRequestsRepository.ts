import { BaseRepository } from '@/shared/api/baseRepository';
import {
    ApiResponseFeatureRequest,
    FeatureRequest,
} from '@/shared/models/requestModel';

export class FeatureRequestsRepository extends BaseRepository<
    ApiResponseFeatureRequest,
    FeatureRequest
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
