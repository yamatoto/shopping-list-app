import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Modal,
    TouchableOpacity,
} from 'react-native';

const tableData = [
    { feature: 'リアルタイム更新', importance: '高', cost: '高', notes: '' },
    {
        feature: 'レンダリング見直し・修正',
        importance: '高',
        cost: '高',
        notes: '',
    },
    { feature: '通知処理', importance: '高', cost: '高', notes: '' },
    {
        feature: '詳細画面',
        importance: '高',
        cost: '高',
        notes: 'カテゴライズ、メモ、更新処理',
    },
    {
        feature: 'カテゴリー表示',
        importance: '高',
        cost: '少',
        notes: 'アコーディオン、カテゴリごとの追加',
    },
    { feature: '一括状態更新', importance: '中', cost: '少', notes: '' },
    {
        feature: '欲しいものタブ',
        importance: '中',
        cost: '少',
        notes: '欲しい人でフィルタ',
    },
    {
        feature: '削除ボタンやめて横スワイプで削除',
        importance: '中',
        cost: '高',
        notes: '',
    },
    {
        feature: 'ユーザー認証情報のグルーバル保持',
        importance: '中',
        cost: '小',
        notes: '',
    },
    { feature: '画像添付', importance: '低', cost: '中', notes: '' },
    { feature: '検索', importance: '低', cost: '高', notes: '' },
];

interface PlannedFeaturesModalProps {
    visible: boolean;
    onClose: () => void;
}

const PlannedFeaturesModal: React.FC<PlannedFeaturesModalProps> = ({
    visible,
    onClose,
}) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.modalContent}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>閉じる</Text>
                </TouchableOpacity>
                <ScrollView>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.cell, styles.headerText]}>
                            機能
                        </Text>
                        <Text style={[styles.cell, styles.headerText]}>
                            重要度
                        </Text>
                        <Text style={[styles.cell, styles.headerText]}>
                            コスト
                        </Text>
                        <Text style={[styles.cell, styles.headerText]}>
                            備考
                        </Text>
                    </View>
                    {tableData.map((row, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.cell}>{row.feature}</Text>
                            <Text style={styles.cell}>{row.importance}</Text>
                            <Text style={styles.cell}>{row.cost}</Text>
                            <Text style={styles.cell}>{row.notes}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        paddingTop: 50, // 状況に応じてパディングを調整
        paddingHorizontal: 16,
        backgroundColor: 'white',
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 5,
        marginBottom: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
    },
    headerText: {
        fontWeight: 'bold',
    },
});

export default PlannedFeaturesModal;
