import { Star } from '@phosphor-icons/react';
import { useLanguage } from '../../../context/LanguageContext';

export default function FeedbackPanel({ submission }) {
  const { t } = useLanguage();
  if (submission.status !== 'Accepted') {
    return <p className="text-sm text-muted-foreground">{t('intern.assignments.awaitingEvaluation')}</p>;
  }

  return (
    <div className="rounded-md border border-accent/30 bg-accent/5 px-4 py-3">
      <p className="flex items-center gap-2 text-sm font-semibold text-accent">
        <Star className="h-4 w-4" weight="fill" aria-hidden="true" />
        {t('intern.assignments.grade', { grade: submission.grade })}
      </p>
      {submission.feedback && <p className="mt-2 text-sm text-foreground">{submission.feedback}</p>}
    </div>
  );
}
