import { MagnifyingGlass } from '@phosphor-icons/react';
import Select from '../../../components/ui/Select';
import { ApplicationStatus } from '../../../domain/enums';
import { useLanguage } from '../../../context/LanguageContext';

export default function ApplicationsFilterBar({ status, onStatusChange, search, onSearchChange }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <MagnifyingGlass className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('admin.applications.searchPlaceholder')}
          aria-label={t('admin.applications.searchAriaLabel')}
          className="h-11 w-full rounded-md border border-border bg-card ps-9 pe-3 text-[15px] text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <Select
        id="status-filter"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="sm:w-56"
        aria-label={t('admin.applications.filterAriaLabel')}
      >
        <option value="">{t('common.allStatuses')}</option>
        {Object.values(ApplicationStatus).map((value) => (
          <option key={value} value={value}>
            {t(`status.${value}`)}
          </option>
        ))}
      </Select>
    </div>
  );
}
