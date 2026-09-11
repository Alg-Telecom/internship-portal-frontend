import SidebarNavItem from './SidebarNavItem';
import logo from '../../assets/algerie-telecom-logo.png';
import { cn } from '../../lib/utils';

export default function Sidebar({ navItems, roleLabel, className, onNavigate }) {
  return (
    <nav className={cn('flex h-full w-64 flex-col bg-primary px-3 py-4', className)} aria-label="Primary">
      <div className="flex items-center gap-2 px-2 pb-6">
        <img src={logo} alt="Algerie Telecom" className="h-8 w-8 rounded bg-white object-contain p-1" />
        <div>
          <p className="text-sm font-semibold leading-tight text-white">IMP</p>
          <p className="text-xs leading-tight text-white/60">{roleLabel}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <SidebarNavItem key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </div>
    </nav>
  );
}
