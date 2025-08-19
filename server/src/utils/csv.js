
import { parse } from 'csv-parse/sync';

export function parseCSV(buffer) {
  const text = buffer.toString('utf8');
  const rows = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
  return rows;
}