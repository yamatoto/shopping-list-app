import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, TextInput, FlatList } from 'react-native';


interface Item {
    id: number;
    text: string;
    completed: boolean;
}
export default function ShoppingListScreen() {
    const [items, setItems] = useState<Item[]>([]);
    const [newItem, setNewItem] = useState<string>('');

    const addItem = () => {
        if (newItem) {
            setItems([...items, { id: Date.now(), text: newItem, completed: false }]);
            setNewItem('');
        }
    };

    const toggleItem = (id: number) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const deleteItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const renderItem = ({ item }: { item: Item }) => (
        <View style={styles.item}>
            <TouchableOpacity onPress={() => toggleItem(item.id)}>
                <Text style={item.completed ? styles.completedItem : undefined}>{item.text}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
                <Text style={styles.deleteButton}>削除</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>買い物リスト</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newItem}
                    onChangeText={setNewItem}
                    placeholder="新しいアイテムを追加"
                />
                <TouchableOpacity style={styles.addButton} onPress={addItem}>
                    <Text style={styles.addButtonText}>追加</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginRight: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    addButton: {
        backgroundColor: '#5cb85c',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    completedItem: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    deleteButton: {
        color: '#d9534f',
    },
});
