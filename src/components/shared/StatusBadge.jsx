import Badge from '../ui/Badge';
import { STATUS_TONE } from '../../domain/enums';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Single source of truth for turning any domain enum value (ApplicationStatus,
 * AssignmentStatus, AttendanceStatus, ...) into a consistently colored pill.
 * Reused by every table/detail page instead of re-implementing per feature.
 */
export default function StatusBadge({ status, className }) {
  const { t } = useLanguage();
  if (!status) return null;
  const tone = STATUS_TONE[status] || 'muted';
  const key = `status.${status}`;
  const label = t(key) !== key ? t(key) : status.replace(/([a-z])([A-Z])/g, '$1 $2');
  return (
    <Badge tone={tone} className={className}>
      {label}
    </Badge>
  );
}
