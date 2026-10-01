import { useState } from 'react';
import { UsersThree, FileText, ClockCounterClockwise } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useTeams } from '../../hooks/useTeams';
import { useApplications } from '../../hooks/useApplications';
import { useInterns } from '../../hooks/useUsers';
import { useCalendarEvents, useCreateCalendarEvent, useDeleteCalendarEvent } from '../../hooks/useCalendarEvents';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/shared/StatCard';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { SkeletonRows } from '../../components/ui/Skeleton';
import EmptyState from '../../components/shared/EmptyState';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import TeamOverviewCard from './components/TeamOverviewCard';
import InternshipCalendar from '../../components/shared/InternshipCalendar';
import CalendarEventFormDialog from './components/CalendarEventFormDialog';
import { useLanguage } from '../../context/LanguageContext';
import { TeamStatus } from '../../domain/enums';

// The dashboard only shows current teams; Completed (and Cancelled) ones
// stay listed on the Teams page.
const CURRENT_TEAM_STATUSES = [TeamStatus.ACTIVE, TeamStatus.PLANNED];

export default function DashboardPage() {
  const { t } = useLanguage();
  usePageHeader(t('admin.dashboard.title'));
  const { teams, isLoading: teamsLoading } = useTeams();
  const currentTeams = teams.filter((team) => CURRENT_TEAM_STATUSES.includes(team.status));
  const { applications } = useApplications({ status: 'Pending' });
  const { interns } = useInterns();
  const { events, isLoading: eventsLoading } = useCalendarEvents();
  const createCalendarEvent = useCreateCalendarEvent();
  const deleteCalendarEvent = useDeleteCalendarEvent();
  const { showToast } = useToast();
  const [addingEventFor, setAddingEventFor] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);

  async function handleCreateEvent(values) {
    await createCalendarEvent.mutateAsync(values);
    showToast(t('admin.dashboard.eventAdded'));
  }

  async function confirmDeleteEvent() {
    await deleteCalendarEvent.mutateAsync(deletingEvent.id);
    showToast(t('admin.dashboard.eventDeleted'), { type: 'info' });
    setDeletingEvent(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={UsersThree} label={t('admin.dashboard.activeInterns')} value={interns.length} />
        <StatCard icon={FileText} label={t('admin.dashboard.pendingApplications')} value={applications.length} tone="accent" />
        <StatCard icon={ClockCounterClockwise} label={t('admin.dashboard.internshipTeams')} value={teams.length} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.dashboard.teamsCardTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          {teamsLoading ? (
            <SkeletonRows rows={3} />
          ) : currentTeams.length === 0 ? (
            <EmptyState icon={UsersThree} title={t('admin.dashboard.noTeamsYet')} description={t('admin.dashboard.noTeamsDescription')} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {currentTeams.map((team) => (
                <TeamOverviewCard key={team.id} team={team} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.dashboard.calendarCardTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <InternshipCalendar
            events={events}
            isLoading={eventsLoading}
            onAddEvent={(date) => setAddingEventFor(date)}
            onDeleteEvent={(event) => setDeletingEvent(event)}
          />
        </CardContent>
      </Card>

      <CalendarEventFormDialog
        open={!!addingEventFor}
        defaultDate={addingEventFor}
        onClose={() => setAddingEventFor(null)}
        onSubmit={handleCreateEvent}
      />
      <ConfirmDialog
        open={!!deletingEvent}
        onClose={() => setDeletingEvent(null)}
        onConfirm={confirmDeleteEvent}
        isLoading={deleteCalendarEvent.isPending}
        title={t('admin.dashboard.deleteEventTitle')}
        description={deletingEvent ? t('admin.dashboard.deleteEventDescription', { title: deletingEvent.title }) : ''}
      />
    </div>
  );
}
