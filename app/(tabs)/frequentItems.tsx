import { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';

import { sharedStyles } from '@/styles/sharedStyles';
import { useShoppingListQuery } from '@/queries/useShoppingListQuery';
import { useShoppingListUsecase } from '@/usecases/useShoppingListUsecase';
import { DisplayItem } from '@/models/itemModel';

export default function FrequentShoppingListScreen() {
    const { frequentItems, refreshing } = useShoppingListQuery();
    const {
        initialize,
        handleRefresh,
        handleAddItem,
        // handleUpdateItem,
        handleDeleteItem,
        handleAddToCurrent,
    } = useShoppingListUsecase();
    const [newItemName, setNewItemName] = useState('');

    useEffect(() => {
        initialize().then();
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: DisplayItem }) => {
            return (
                <View style={sharedStyles.itemContainer}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                        }}
                    >
                        <Text style={sharedStyles.itemNameText}>
                            {item.name}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => handleAddToCurrent(item)}
                        disabled={item.isCurrent}
                        style={[
                            sharedStyles.button,
                            item.isCurrent
                                ? sharedStyles.addedButton
                                : sharedStyles.addButton,
                        ]}
                    >
                        <Text
                            style={sharedStyles.buttonText}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {item.isCurrent ? '直近に追加済' : '直近に追加'}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        },
        [handleAddToCurrent],
    );

    const renderHiddenItem = useCallback(
        ({ item }: { item: DisplayItem }) => (
            <View style={sharedStyles.rowBack}>
                <TouchableOpacity
                    style={sharedStyles.backRightBtn}
                    onPress={() => handleDeleteItem(item, false)}
                >
                    <Text style={sharedStyles.backTextWhite}>削除</Text>
                </TouchableOpacity>
            </View>
        ),
        [handleDeleteItem],
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={sharedStyles.container}>
                <View style={sharedStyles.inputContainer}>
                    <TextInput
                        style={sharedStyles.input}
                        value={newItemName}
                        onChangeText={setNewItemName}
                        placeholderTextColor="#888"
                        placeholder="新しい定番の買い物を追加"
                    />
                    <TouchableOpacity
                        style={sharedStyles.addButton}
                        onPress={() => handleAddItem(newItemName, false)}
                    >
                        <Text style={sharedStyles.addButtonText}>追加</Text>
                    </TouchableOpacity>
                </View>

                <SwipeListView
                    contentContainerStyle={{ backgroundColor: '#f0f0f0' }}
                    ItemSeparatorComponent={() => (
                        <View
                            style={{ height: 1, backgroundColor: '#f0f0f0' }}
                        />
                    )}
                    closeOnRowOpen={true}
                    rightOpenValue={-75}
                    data={frequentItems}
                    renderItem={renderItem}
                    renderHiddenItem={item => renderHiddenItem(item)}
                    disableRightSwipe
                    keyExtractor={item => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={['#5cb85c']}
                            tintColor="#5cb85c"
                        />
                    }
                />
            </View>
        </GestureHandlerRootView>
    );
}
