import './styles/global.css';

import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { useDesktopPresenter } from './presenters/useDesktopPresenter';

import { DesktopView } from './views/desktop/DesktopView';

function App() {
  const presenter = useDesktopPresenter();
  return <DesktopView presenter={presenter} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
