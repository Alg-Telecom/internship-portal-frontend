import { Tab } from '@headlessui/react';
import { cn } from '../../lib/utils';

/**
 * Thin wrapper around Headless UI's Tab (keyboard arrow navigation +
 * correct aria roles built in). `tabs` is [{ key, label, content }].
 */
export default function Tabs({ tabs, defaultIndex = 0 }) {
  return (
    <Tab.Group defaultIndex={defaultIndex}>
      <Tab.List className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            className={({ selected }) =>
              cn(
                'cursor-pointer border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-t-md',
                selected
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )
            }
          >
            {tab.label}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="pt-4">
        {tabs.map((tab) => (
          <Tab.Panel key={tab.key}>{tab.content}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
