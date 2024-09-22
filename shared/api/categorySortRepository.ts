import { BaseRepository } from '@/shared/api/baseRepository';
import {
    ApiResponseCategorySort,
    CategorySortBase,
} from '@/shared/models/categorySortModel';

export class CategorySortRepository extends BaseRepository<
    ApiResponseCategorySort,
    CategorySortBase
> {
    constructor() {
        super('category-sort');
    }
}
