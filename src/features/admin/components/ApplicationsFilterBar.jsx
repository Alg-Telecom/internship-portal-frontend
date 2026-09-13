import { MagnifyingGlass } from '@phosphor-icons/react';
import Select from '../../../components/ui/Select';
import { ApplicationStatus } from '../../../domain/enums';

export default function ApplicationsFilterBar({ status, onStatusChange, search, onSearchChange }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by candidate name or email"
          aria-label="Search applications"
          className="h-11 w-full rounded-md border border-border bg-card pl-9 pr-3 text-[15px] text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <Select
        id="status-filter"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="sm:w-56"
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {Object.values(ApplicationStatus).map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </Select>
    </div>
  );
}
