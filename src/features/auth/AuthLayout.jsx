import logo from '../../assets/algerie-telecom-logo.png';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
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
