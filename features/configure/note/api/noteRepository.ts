import { BaseRepository } from '@/shared/api/baseRepository';
import {
    ApiResponseNote,
    NoteBase,
} from '@/features/configure/note/models/noteModel';

export class NoteRepository extends BaseRepository<ApiResponseNote, NoteBase> {
    constructor() {
        super('note');
    }
}
