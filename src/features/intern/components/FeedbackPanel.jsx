import { Star } from '@phosphor-icons/react';

export default function FeedbackPanel({ submission }) {
  if (submission.status !== 'Accepted') {
    return <p className="text-sm text-muted-foreground">Your submission is awaiting evaluation.</p>;
  }

  return (
    <div className="rounded-md border border-accent/30 bg-accent/5 px-4 py-3">
      <p className="flex items-center gap-2 text-sm font-semibold text-accent">
        <Star className="h-4 w-4" weight="fill" aria-hidden="true" />
        Grade: {submission.grade}/20
      </p>
      {submission.feedback && <p className="mt-2 text-sm text-foreground">{submission.feedback}</p>}
    </div>
  );
}
