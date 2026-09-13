import { useState } from 'react';
import { UsersThree, FileText, ClockCounterClockwise } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useTeams } from '../../hooks/useTeams';
import { useApplications } from '../../hooks/useApplications';
import { useInterns } from '../../hooks/useUsers';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/shared/StatCard';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { SkeletonRows } from '../../components/ui/Skeleton';
import EmptyState from '../../components/shared/EmptyState';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import TeamOverviewCard from './components/TeamOverviewCard';
import InternshipCalendar from '../../components/shared/InternshipCalendar';
import CalendarEventFormDialog from './components/CalendarEventFormDialog';
import * as calendarApi from '../../services/mockApi/calendarApi';

export default function DashboardPage() {
  usePageHeader('Dashboard');
  const { teams, isLoading: teamsLoading } = useTeams();
  const { applications } = useApplications({ status: 'Pending' });
  const { interns } = useInterns();
  const { events, isLoading: eventsLoading, refetch: refetchEvents } = useCalendarEvents();
  const { showToast } = useToast();
  const [addingEventFor, setAddingEventFor] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleCreateEvent(values) {
    await calendarApi.createEvent(values);
    showToast('Event added to the calendar.');
    refetchEvents();
  }

  async function confirmDeleteEvent() {
    setIsDeleting(true);
    try {
      await calendarApi.deleteEvent(deletingEvent.id);
      showToast('Event deleted.', { type: 'info' });
      setDeletingEvent(null);
      refetchEvents();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={UsersThree} label="Active interns" value={interns.length} />
        <StatCard icon={FileText} label="Pending applications" value={applications.length} tone="accent" />
        <StatCard icon={ClockCounterClockwise} label="Internship teams" value={teams.length} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Internship Teams</CardTitle>
        </CardHeader>
        <CardContent>
          {teamsLoading ? (
            <SkeletonRows rows={3} />
          ) : teams.length === 0 ? (
            <EmptyState icon={UsersThree} title="No teams yet" description="Create a team to start assigning interns and supervisors." />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <TeamOverviewCard key={team.id} team={team} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Internship Calendar</CardTitle>
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
        isLoading={isDeleting}
        title="Delete event"
        description={deletingEvent ? `This permanently removes "${deletingEvent.title}" from the calendar. This cannot be undone.` : ''}
      />
    </div>
  );
}
