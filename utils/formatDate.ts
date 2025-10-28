import { format, parseISO, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'PPP') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatTime = (date: string | Date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'p');
  } catch (error) {
    return 'Invalid time';
  }
};

export const formatDateTime = (date: string | Date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'PPP p');
  } catch (error) {
    return 'Invalid date time';
  }
};

export const formatRelativeTime = (date: string | Date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};
