import { Link } from 'react-router-dom';
import { CheckCircle } from '@phosphor-icons/react';

export default function ApplicationSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle className="h-9 w-9 text-accent" weight="fill" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">You have successfully applied!</h1>
        <p className="text-sm text-muted-foreground">
          Our team will review your application. We will inform you by email — don't forget to check your spam folder.
        </p>
        <Link
          to="/login"
          className="mt-2 inline-flex h-11 items-center justify-center rounded-md border border-border bg-transparent px-4 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Back to Sign in
        </Link>
      </div>
    </div>
  );
}
