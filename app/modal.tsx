import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ItemModal() {

  const { id } = useLocalSearchParams();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  // for editing when we are running local
  const [editMode, setEditMode] = useState(false);

  const database = useSQLiteContext();

  React.useEffect(() => {
    if (id) {
      setEditMode(true);
      loadData();
    }
  }, [id]);


  // method to laod data
  const loadData = async () => {
    const result = await database.getFirstAsync<{
      id: number;
      name: string;
      email: string;
    }>(`SELECT * FROM users WHERE id = ?`, [parseInt(id as string)]);
    setName(result?.name!);
    setEmail(result?.email!);
  };

  const handleDelete = async (id: number) => {
    try {
      await database.runAsync("DELETE FROM users WHERE id = ?", [id]);
      loadData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
    }

  // method to save data
  const handleSave = async () => {
    try {
      const response = await database.runAsync(
        `INSERT INTO users (name, email) VALUES (?, ?)`,
        [name, email]
      );
      console.log("Item saved successfully:", response?.changes!);
      router.back();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  // method to update data
  const handleUpdate = async () => {
    try {
      const response = await database.runAsync(
        `UPDATE users SET name = ?, email = ? WHERE id = ?`,
        [name, email, parseInt(id as string)]
      );
      console.log("Item updated successfully:", response?.changes!);
      router.back();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };


  return (
    // ou colors
    <SafeAreaView style={[styles.container, { backgroundColor: "#FDF9E7" }]}>
      <Stack.Screen options={{ title: "Item Modal" }} />
      <View
        style={{
          gap: 20,
          marginVertical: 20,
        }}
      >
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.textInput}
        />
        <TextInput
          placeholder="Email"
          value={email}
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
        />
      </View>
      <View style={{ flex: 1, flexDirection: "row", gap: 20 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          // ou colors
          style={[styles.button, { backgroundColor: "#841617" }]}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            editMode ? handleUpdate() : handleSave();
          }}
          // ou colors
          style={[styles.button, { backgroundColor: "#841617" }]}
        >
          <Text style={styles.buttonText}>{editMode ? "Update" : "Save"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
    width: 300,
    borderRadius: 5,
    borderColor: "slategray",
  },
  button: {
    height: 40,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
});