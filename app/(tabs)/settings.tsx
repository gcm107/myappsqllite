import { View, Text, StyleSheet } from 'react-native';

export default function Tab() {
  return (
    // ou colors
    <View style={[styles.container, { backgroundColor: "#FDF9E7" }]}>
      <Text>Tab [Settings]</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
