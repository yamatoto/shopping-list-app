import { BaseRepository } from '@/shared/api/baseRepository';
import { ApiResponseBugReport, BugReport } from '@/shared/models/requestModel';

export class BugReportsRepository extends BaseRepository<
    ApiResponseBugReport,
    BugReport
> {
    constructor() {
        super('bug-reports', 'バグ報告');
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
