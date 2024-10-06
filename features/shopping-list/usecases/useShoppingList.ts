import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

import { ItemsRepository } from '@/shared/api/itemsRepository';
import {
    SHOPPING_PLATFORM_DETAIL,
    SHOPPING_PLATFORM_DETAIL_TO_LABEL_MAP,
    SHOPPING_PLATFORM_TO_LABEL_MAP,
    ShoppingPlatformId,
} from '@/shared/constants/shoppingPlatform';
import { ScreenLabel } from '@/features/shopping-list/constants/screen';
import { ApiResponseCategorySort } from '@/shared/models/categorySortModel';
import { ApiResponseItem, DisplayItem } from '@/shared/models/itemModel';
import {
    FormattedInputValues,
    INPUT_KEY_LABELS,
    InputValues,
} from '@/features/shopping-list/models/form';

export abstract class ShoppingList {
    private readonly itemsRepository: ItemsRepository;
    private readonly screenLabel: ScreenLabel;

    protected constructor(
        itemRepository: ItemsRepository,
        screenLabel: ScreenLabel,
    ) {
        this.itemsRepository = itemRepository;
        this.screenLabel = screenLabel;
    }

    abstract isDuplicate(
        fetchedItem: QueryDocumentSnapshot<ApiResponseItem, DocumentData>,
    ): boolean;

    async findRegisteredItem(newItemName: string) {
        const fetchedItems = await this.itemsRepository.findBy(
            'name',
            newItemName,
        );
        const fetchedItem = fetchedItems[0];
        if (!fetchedItem) {
            return {
                isDuplicate: false,
                registeredItem: null,
            };
        }

        const id = fetchedItem.id;
        const { isCurrent, isFrequent } = fetchedItem.data();

        return {
            isDuplicate: this.isDuplicate(fetchedItem),
            registeredItem: {
                id,
                isCurrent,
                isFrequent,
            },
        };
    }

    abstract generateUpdateParams(registeredItem: {
        isCurrent: boolean;
        isFrequent: boolean;
    }): {
        isCurrent: boolean;
        isFrequent: boolean;
    };

    abstract generateAddParams(): {
        isCurrent: boolean;
        isFrequent: boolean;
    };

    async addItem({
        newItemName,
        createdUser,
        selectedShoppingPlatformId,
    }: {
        newItemName: string;
        createdUser: string;
        selectedShoppingPlatformId: ShoppingPlatformId;
    }) {
        const trimmedItemName = newItemName.trim();
        if (!trimmedItemName) return;

        const { isDuplicate, registeredItem } =
            await this.findRegisteredItem(newItemName);
        if (isDuplicate) {
            throw new Error('登録済');
        }

        if (registeredItem) {
            await this.itemsRepository.update(
                {
                    id: registeredItem.id,
                    name: trimmedItemName,
                    updatedUser: createdUser,
                    ...this.generateUpdateParams(registeredItem),
                },
                `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の${this.screenLabel}の買い物リストに「${newItemName}」を追加しました。`,
            );
            return;
        }

        await this.itemsRepository.add(
            {
                name: trimmedItemName,
                quantity: 1,
                categoryId: '',
                shoppingPlatformId: selectedShoppingPlatformId,
                shoppingPlatformDetailId: SHOPPING_PLATFORM_DETAIL.NOT_SET.id,
                createdUser,
                updatedUser: createdUser,
                ...this.generateAddParams(),
            },
            `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の${this.screenLabel}の買い物リストに「${trimmedItemName}」を追加しました。`,
        );
    }

    trimItem(item: InputValues): InputValues {
        return Object.keys(item).reduce((acc, key) => {
            const value = item[key as keyof InputValues];
            acc[key as keyof InputValues] = value?.trim() as any;
            return acc;
        }, {} as InputValues);
    }

    CHANGED_CONTENT_MAP = {
        quantity: (beforeItem: DisplayItem, values: FormattedInputValues) => {
            return `${INPUT_KEY_LABELS.quantity}: ${beforeItem.quantity} → ${values.quantity}`;
        },
        name: (beforeItem: DisplayItem, values: FormattedInputValues) => {
            return `${INPUT_KEY_LABELS.name}: ${beforeItem.name} → ${values.name}`;
        },
        categoryId: (
            beforeItem: DisplayItem,
            values: FormattedInputValues,
            resultOfFetchCategorySort: QueryDocumentSnapshot<ApiResponseCategorySort> | null,
        ) => {
            const categories = resultOfFetchCategorySort?.data().categories;
            const beforeCategoryName =
                categories?.find(({ id }) => id === beforeItem.categoryId)
                    ?.name ?? '未設定';
            const newCategoryName =
                categories?.find(({ id }) => id === values.categoryId)?.name ??
                '未設定';
            return `${INPUT_KEY_LABELS.categoryId}: ${beforeCategoryName} → ${newCategoryName}`;
        },
        shoppingPlatformDetailId: (
            beforeItem: DisplayItem,
            values: FormattedInputValues,
        ) => {
            return `${INPUT_KEY_LABELS.shoppingPlatformDetailId}: ${SHOPPING_PLATFORM_DETAIL_TO_LABEL_MAP[beforeItem.shoppingPlatformDetailId]} → ${SHOPPING_PLATFORM_DETAIL_TO_LABEL_MAP[values.shoppingPlatformDetailId]}`;
        },
    } as const;

    getChangedContent(
        beforeItem: DisplayItem,
        values: FormattedInputValues,
        resultOfFetchCategorySort: QueryDocumentSnapshot<ApiResponseCategorySort> | null,
    ) {
        return (Object.keys(values) as Array<keyof FormattedInputValues>)
            .filter(key => values[key] !== beforeItem[key])
            .map(key =>
                this.CHANGED_CONTENT_MAP[key](
                    beforeItem,
                    values as FormattedInputValues,
                    resultOfFetchCategorySort,
                ),
            )
            .join('\n');
    }

    formatInputValues(
        beforeItem: DisplayItem,
        values: InputValues,
    ): FormattedInputValues & { id: string } {
        const trimmedValues = this.trimItem(values);
        const { quantity, ...rest } = trimmedValues;
        return {
            id: beforeItem.id,
            ...rest,
            quantity: parseInt(quantity, 10),
        };
    }

    async updateItem({
        beforeItem,
        values,
        updatedUser,
        selectedShoppingPlatformId,
        resultOfFetchCategorySort,
    }: {
        beforeItem: DisplayItem;
        values: InputValues;
        updatedUser: string;
        selectedShoppingPlatformId: ShoppingPlatformId;
        resultOfFetchCategorySort: QueryDocumentSnapshot<ApiResponseCategorySort> | null;
    }) {
        const formatedInputValues = this.formatInputValues(beforeItem, values);
        const { name: trimmedUpdateName } = formatedInputValues;
        const changedContent = this.getChangedContent(
            beforeItem,
            formatedInputValues,
            resultOfFetchCategorySort,
        );
        if (!changedContent) return;

        if (trimmedUpdateName && trimmedUpdateName !== beforeItem.name) {
            const { isDuplicate } =
                await this.findRegisteredItem(trimmedUpdateName);
            if (isDuplicate) {
                throw new Error('登録済');
            }
        }

        await this.itemsRepository.update(
            {
                ...beforeItem,
                ...formatedInputValues,
                updatedUser,
            },
            `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の${this.screenLabel}の買い物リストの「${beforeItem.name}」を更新しました。\n${changedContent}`,
        );
    }
}
