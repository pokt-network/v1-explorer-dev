import dayjs from 'dayjs';

// Handles Block times like 2023-05-31 22:12:09.088720938 +0000 UTC
export function parsePocketBlockDate(dateStr: string) {
  const parts = dateStr.split(' ');
  if (parts.length < 2) return null; // Return null if the date string is not in the expected format

  const datePart = parts[0];
  const timePart = parts[1];

  if (datePart && timePart) {
    const dateAndTime =
      datePart + 'T' + timePart.substring(0, timePart.lastIndexOf('.'));
    const dateObj = dayjs(dateAndTime);
    return dateObj;
  } else {
    return null; // Return null if datePart or timePart is undefined
  }
}
