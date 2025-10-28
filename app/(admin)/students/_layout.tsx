import { Stack } from 'expo-router';

export default function StudentsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Students',
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: 'Add Student',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Student Details',
        }}
      />
    </Stack>
  );
}
