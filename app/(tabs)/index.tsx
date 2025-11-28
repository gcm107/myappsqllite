import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { router, Stack, useFocusEffect} from 'expo-router';
import React, { useState, useCallback } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSQLiteContext } from "expo-sqlite";

type UserType = {id:number; name: string; email: string}; 

export default function TabHome() {
  const [data, setData] = useState<UserType[]>([]);

  const database = useSQLiteContext();

  const loadData = async () => {
    const result = await database.getAllAsync<UserType>("SELECT * FROM users");
    setData(result);
  };

  const handleDelete = async (id: number) => {
    try {
      await database.runAsync("DELETE FROM users WHERE id = ?", [id]);
      loadData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData(); 
    }, [])
  );


  const headerRight = () => {
    return (
      <TouchableOpacity 
        onPress={() => router.push('/modal')}
        style={{ marginRight: 10 }}
      >
        <FontAwesome name="plus-circle" size={28} color="#841617" />
        </TouchableOpacity>
      
    );
  };

  return (
    // added ou colors
    <View style={{ flex: 1, backgroundColor: "#FDF9E7" }}>
      <Stack.Screen options={{ headerRight }} />
      <View style={{ flex: 1 }}>
        <FlatList
          data={data}
          // added ou colors
          style={{ backgroundColor: "#FDF9E7" }}
          renderItem={({ item }: { item: UserType }) => (
            <View style={{ padding: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text>{item.name}</Text>
                  <Text>{item.email}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      router.push(`/modal?id=${item.id}`);
                    }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleDelete(item.id);
                    }}
                    // added ou colors
                    style={[styles.button, { backgroundColor: "#841617" }]}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  // button style
  button: {
    height: 30,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: "#841617",
    alignContent: "flex-end",
  },

  // button text style
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
});