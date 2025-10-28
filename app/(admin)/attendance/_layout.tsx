import { Stack } from 'expo-router';

export default function AttendanceLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Mark Attendance',
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          title: 'Attendance History',
        }}
      />
    </Stack>
  );
}
