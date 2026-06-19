type Props = {
  header?: string[];
  rows: Record<string, string>[];
  maxCols?: number;
  maxRows?: number;
  onRowClick?: (row: Record<string, string>, index: number) => void;
};

export function LiveDataTable({ header, rows, maxCols = 6, maxRows = 50, onRowClick }: Props) {
  if (!rows.length) return <p className="text-muted">No rows to display.</p>;

  const cols = (header ?? Object.keys(rows[0])).slice(0, maxCols);

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {cols.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, maxRows).map((row, i) => (
            <tr
              key={i}
              className={onRowClick ? "data-row-clickable" : undefined}
              onClick={onRowClick ? () => onRowClick(row, i) : undefined}
            >
              {cols.map((h) => (
                <td key={h} title={String(row[h] ?? "")}>
                  {String(row[h] ?? "").slice(0, 200)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > maxRows && (
        <p className="text-muted table-foot">Showing {maxRows} of {rows.length} rows</p>
      )}
    </div>
  );
}
