import { Stack } from 'expo-router';

export default function EventsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Events',
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: 'Create Event',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Event Details',
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: 'Edit Event',
        }}
      />
    </Stack>
  );
}
