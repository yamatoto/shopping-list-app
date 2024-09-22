import { BaseRepository } from '@/shared/api/baseRepository';
import {
    ApiResponseBugReport,
    BugReportBase,
} from '@/features/configure/bugReport/models/bugReportModel';

export class BugReportsRepository extends BaseRepository<
    ApiResponseBugReport,
    BugReportBase
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
