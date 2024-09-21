import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, SectionListData } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeRow } from 'react-native-swipe-list-view';

import CommonSwipeListView from '../../../../../shared/components/CommonSwipeListView';

import { sharedStyles } from '@/shared/styles/sharedStyles';
import { useFeatureRequestQuery } from '@/features/configure/featureRequest/queries/useFeatureRequestQuery';
import { useFeatureRequestUsecase } from '@/features/configure/featureRequest/usecases/useFeatureRequestUsecase';
import FeatureRequestContainer from '@/features/configure/featureRequest/views/components/FeatureRequestContainer';
import { DisplayFeatureRequest } from '@/features/configure/featureRequest/models/featureRequestModel';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import { featureRequestStyles } from '@/features/configure/featureRequest/views/pages/styles';
import HiddenItemWithModal from '@/features/configure/featureRequest/views/components/HiddenItemWithModal';
import { EmptyComponent } from '@/shared/components/EmptyComponent';
import FeatureRequestEditModal from '@/features/configure/featureRequest/views/components/FeatureRequestEditModal';

export default function FeatureRequest() {
    const { sections, refreshing } = useFeatureRequestQuery();
    const {
        initialize,
        handleRefresh,
        handleAddFeatureRequest,
        handleUpdateFeatureRequest,
        handleCompleteFeatureRequestCheckToggle,
        handleRejectFeatureRequest,
    } = useFeatureRequestUsecase();
    const [modalVisible, setModalVisible] = useState(false);
    const { currentUser } = useFirebaseAuth();

    useEffect(() => {
        initialize().then();
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: DisplayFeatureRequest }) => {
            const canReject =
                currentUser?.isDeveloper && !item.completed && !item.rejected;
            return (
                // @ts-ignore
                <SwipeRow
                    rightOpenValue={canReject ? -75 : 0}
                    disableRightSwipe={true}
                    disableLeftSwipe={!canReject}
                    swipeToOpenPercent={30}
                >
                    {canReject ? (
                        <HiddenItemWithModal
                            item={item}
                            onReject={handleRejectFeatureRequest}
                        />
                    ) : (
                        <EmptyComponent />
                    )}
                    <View style={featureRequestStyles.rowFront}>
                        <FeatureRequestContainer
                            featureRequest={item}
                            handleCompleteFeatureRequestCheckToggle={
                                handleCompleteFeatureRequestCheckToggle
                            }
                            updateFeatureRequest={updated =>
                                handleUpdateFeatureRequest(item, updated)
                            }
                        />
                    </View>
                </SwipeRow>
            );
        },
        [
            currentUser?.isDeveloper,
            handleCompleteFeatureRequestCheckToggle,
            handleUpdateFeatureRequest,
            handleRejectFeatureRequest,
        ],
    );

    const renderSectionHeader = useCallback(
        ({
            section: { title },
        }: {
            section: SectionListData<DisplayFeatureRequest>;
        }) => (
            <View style={featureRequestStyles.sectionHeader}>
                <Text style={featureRequestStyles.sectionHeaderText}>
                    {title}
                </Text>
            </View>
        ),
        [],
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={sharedStyles.container}>
                <View style={featureRequestStyles.addButtonContainer}>
                    <TouchableOpacity
                        style={featureRequestStyles.addButton}
                        onPress={() => {
                            setModalVisible(true);
                        }}
                    >
                        <Text style={sharedStyles.addButtonText}>追加</Text>
                    </TouchableOpacity>
                </View>

                <CommonSwipeListView
                    useSectionList
                    sections={sections}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    refreshing={refreshing}
                    handleRefresh={handleRefresh}
                />
            </View>

            {modalVisible && (
                <FeatureRequestEditModal
                    addFeatureRequest={handleAddFeatureRequest}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                />
            )}
        </GestureHandlerRootView>
    );
}
