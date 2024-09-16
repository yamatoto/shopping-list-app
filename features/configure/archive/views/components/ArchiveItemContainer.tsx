import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { DisplayItem } from '@/shared/models/itemModel';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import ArchiveItemEditModal from '@/features/configure/archive/views/components/ArchiveItemEditModal';

type Props = {
    item: DisplayItem;
    restoreItem: (isCurrent: boolean) => void;
};
export default function ArchiveItemContainer({ item, restoreItem }: Props) {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <TouchableOpacity
            style={sharedStyles.itemContainer}
            onPress={() => setModalVisible(true)}
            activeOpacity={1}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                }}
            >
                {modalVisible && (
                    <ArchiveItemEditModal
                        restoreItem={restoreItem}
                        item={item}
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                    />
                )}
                <Text style={sharedStyles.itemNameText}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );
}
