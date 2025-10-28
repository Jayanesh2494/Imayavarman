import { Stack } from 'expo-router';

export default function StudentAttendanceLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'My Attendance',
        }}
      />
    </Stack>
  );
}
