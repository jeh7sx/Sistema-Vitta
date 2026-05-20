import { View, Text } from 'react-native';

export default function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
      }}
    >
      <Text
        style={{
          color: '#af9c9c',
          fontSize: 18,
          textAlign: 'center',
        }}
      >
        {text}
      </Text>
    </View>
  );
}