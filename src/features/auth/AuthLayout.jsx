import logo from '../../assets/algerie-telecom-logo.png';
import LanguageSwitcher from '../../components/layout/LanguageSwitcher';

// `widthClassName` lets a page widen the card (the login page does, so its
// longer footer links fit on one line); other auth pages keep max-w-md.
export default function AuthLayout({ title, subtitle, children, widthClassName = 'max-w-md' }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className={`w-full ${widthClassName}`}>
        <div className="mb-3 flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <img src={logo} alt="Algerie Telecom" className="h-14 w-14 rounded-lg bg-white object-contain p-1.5 shadow-card" />
          <div>
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 shadow-card">{children}</div>
      </div>
    </div>
  );
}
