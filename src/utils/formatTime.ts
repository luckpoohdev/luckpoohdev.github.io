import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'; // Import the plugin
import 'dayjs/locale/da';

dayjs.extend(relativeTime); // Extend dayjs with the plugin
dayjs.locale('da');

type InputValue = Date | string | number | null;

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'D MMM YYYY';

  return date ? dayjs(date).format(fm) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'D MMM YYYY HH:mm';

  return date ? dayjs(date).format(fm) : '';
}

export function fDateRange(startDate: string, endDate: string) {
  return `${fDate(startDate)} - ${fDate(endDate)}`;
}

export function fDatePeriod(start: InputValue, end: InputValue) {
  if (!start) return fDate(end);
  if (!end) return fDate(start);

  const startDayjs = dayjs(start);
  const endDayjs = dayjs(end);

  if (startDayjs.isSame(endDayjs, 'day')) {
    return fDate(start);
  } else if (startDayjs.isSame(endDayjs, 'year')) {
    return `${startDayjs.format('D MMM')} - ${endDayjs.format('D MMM YYYY')}`;
  } else {
    return `${fDate(start)} - ${fDate(end)}`;
  }
}

export function fToNow(date: InputValue) {
  return date ? dayjs(date).toNow() : ''; 
}
