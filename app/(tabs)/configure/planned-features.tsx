import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const tableData = [
    {
        feature: '並び替え',
        importance: '高',
        cost: '高',
        notes: '',
    },
    {
        feature: '詳細画面',
        importance: '高',
        cost: '高',
        notes: 'アイテム名、数量、カテゴライズ、メモ、更新処理',
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
    { feature: '画像添付', importance: '低', cost: '中', notes: '' },
    { feature: '検索', importance: '低', cost: '高', notes: '' },
];

export default function PlannedFeaturesScreen() {
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.tableHeader}>
                    <Text style={[styles.cell, styles.headerText]}>機能</Text>
                    <Text style={[styles.cell, styles.headerText]}>重要度</Text>
                    <Text style={[styles.cell, styles.headerText]}>コスト</Text>
                    <Text style={[styles.cell, styles.headerText]}>備考</Text>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50, // 状況に応じてパディングを調整
        paddingHorizontal: 16,
        backgroundColor: 'white',
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
