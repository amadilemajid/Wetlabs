import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function fmtDate(iso: string):     string { return format(parseISO(iso), 'dd MMM yyyy'); }
export function fmtDateTime(iso: string): string { return format(parseISO(iso), 'dd MMM yyyy HH:mm'); }
export function fmtRelative(iso: string): string { return formatDistanceToNow(parseISO(iso), { addSuffix: true }); }
export function toIsoDate(date: Date):    string { return format(date, 'yyyy-MM-dd'); }
