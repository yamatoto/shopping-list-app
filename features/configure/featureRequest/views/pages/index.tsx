import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, SectionListData } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeRow } from 'react-native-swipe-list-view';

import CommonSwipeListView from '@/shared/components/CommonSwipeListView';
import RequestEditModal from '@/shared/components/RequestEditModal';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import { useFeatureRequestQuery } from '@/features/configure/featureRequest/queries/useFeatureRequestQuery';
import { useFeatureRequestUsecase } from '@/features/configure/featureRequest/usecases/useFeatureRequestUsecase';
import FeatureRequestContainer from '@/features/configure/featureRequest/views/components/FeatureRequestContainer';
import {
    DisplayFeatureRequest,
    FEATURE_REQUEST_PRIORITY,
} from '@/shared/models/requestModel';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import { featureRequestStyles } from '@/features/configure/featureRequest/views/pages/styles';
import HiddenItemWithModal from '@/features/configure/featureRequest/views/components/HiddenItemWithModal';
import { EmptyComponent } from '@/shared/components/EmptyComponent';
import ButtonAdd from '@/shared/components/ButtonAdd';
import Loading from '@/shared/components/Loading';

export default function FeatureRequest() {
    const { featureRequestSections, refreshing } = useFeatureRequestQuery();
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
                    <ButtonAdd
                        onPress={() => {
                            setModalVisible(true);
                        }}
                    />
                </View>

                {featureRequestSections[0].data.length === 0 ? (
                    <Loading />
                ) : (
                    <CommonSwipeListView
                        useSectionList
                        sections={featureRequestSections}
                        renderItem={renderItem}
                        renderSectionHeader={renderSectionHeader}
                        refreshing={refreshing}
                        handleRefresh={handleRefresh}
                    />
                )}
            </View>

            {modalVisible && (
                <RequestEditModal
                    contentLabel="実装要望内容"
                    addRequest={handleAddFeatureRequest}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    priorities={FEATURE_REQUEST_PRIORITY}
                />
            )}
        </GestureHandlerRootView>
    );
}
