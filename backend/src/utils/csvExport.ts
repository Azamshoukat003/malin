export interface CsvRow {
  code: string;
  publicUrl: string;
  batchId: string;
  isActive: boolean;
  assignedTo: string;
  createdAt: string;
}

const escapeValue = (value: string): string => {
  const needsQuotes = value.includes(',') || value.includes('"') || value.includes('\n');
  const escaped = value.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
};

export const toCsv = (rows: CsvRow[]): string => {
  const header = 'code,publicUrl,batchId,isActive,assignedTo,createdAt';
  const body = rows
    .map((r) =>
      [
        r.code,
        r.publicUrl,
        r.batchId,
        String(r.isActive),
        r.assignedTo,
        r.createdAt
      ]
        .map((v) => escapeValue(v))
        .join(',')
    )
    .join('\n');

  return `${header}\n${body}`;
};
