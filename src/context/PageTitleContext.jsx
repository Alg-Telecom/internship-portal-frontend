import { createContext, useContext, useEffect, useState } from 'react';

const PageTitleContext = createContext(null);

export function PageTitleProvider({ children }) {
  const [title, setTitle] = useState('');
  return <PageTitleContext.Provider value={{ title, setTitle }}>{children}</PageTitleContext.Provider>;
}

function usePageTitleContext() {
  const ctx = useContext(PageTitleContext);
  if (!ctx) throw new Error('usePageTitleContext must be used within a PageTitleProvider.');
  return ctx;
}

/** Read the current page title (used by Topbar). */
export function usePageTitle() {
  return usePageTitleContext().title;
}

/** Called by each page to set the Topbar title + the document <title>. */
export function usePageHeader(title) {
  const { setTitle } = usePageTitleContext();
  useEffect(() => {
    setTitle(title);
    document.title = title ? `${title} — IMP` : 'IMP';
  }, [title, setTitle]);
}
