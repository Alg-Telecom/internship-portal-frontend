import { Tray } from '@phosphor-icons/react';
import { SkeletonRows } from '../ui/Skeleton';
import EmptyState from './EmptyState';
import { cn } from '../../lib/utils';

/**
 * Generic table shell reused by every list page in the app.
 * `columns`: [{ key, header, render(row), className }]
 */
export default function DataTable({ columns, rows, isLoading, emptyTitle = 'Nothing here yet', emptyDescription, onRowClick, rowKey = 'id' }) {
  if (isLoading) {
    return (
      <div className="p-5">
        <SkeletonRows rows={5} />
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return <EmptyState icon={Tray} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th key={col.key} scope="col" className={cn('px-5 py-3 font-medium text-muted-foreground', col.headerClassName)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[rowKey]}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                'border-b border-border last:border-b-0',
                onRowClick && 'cursor-pointer hover:bg-muted focus-within:bg-muted'
              )}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={
                onRowClick
                  ? (e) => {
                      if (e.key === 'Enter') onRowClick(row);
                    }
                  : undefined
              }
            >
              {columns.map((col) => (
                <td key={col.key} className={cn('px-5 py-3.5 text-foreground', col.className)}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
