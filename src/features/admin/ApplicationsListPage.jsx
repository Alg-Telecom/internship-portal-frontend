import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageHeader } from '../../context/PageTitleContext';
import { useApplications } from '../../hooks/useApplications';
import Card from '../../components/ui/Card';
import ApplicationsFilterBar from './components/ApplicationsFilterBar';
import ApplicationsTable from './components/ApplicationsTable';
import { useLanguage } from '../../context/LanguageContext';

export default function ApplicationsListPage() {
  const { t } = useLanguage();
  usePageHeader(t('admin.applications.title'));
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const { applications, isLoading } = useApplications({ status, search });

  return (
    <Card>
      <ApplicationsFilterBar status={status} onStatusChange={setStatus} search={search} onSearchChange={setSearch} />
      <ApplicationsTable applications={applications} isLoading={isLoading} onReview={(app) => navigate(`/admin/applications/${app.id}`)} />
    </Card>
  );
}
