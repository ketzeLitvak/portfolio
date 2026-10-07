import { Minus, Square, X } from 'lucide-react';
import type { WindowState } from '../models/types';
import { translate } from '../models/types';
import { appRegistry } from '../models/appRegistry';
import type { DesktopPresenter } from '../presenters/useDesktopPresenter';
import { useWindowPresenter } from '../presenters/useWindowPresenter';
export function DesktopWindow({ state, desktop, focused }: { state: WindowState; desktop: DesktopPresenter; focused: boolean }) {
 const app = appRegistry[state.id]; const Icon = app.icon; const View = app.view; const p = useWindowPresenter(state, desktop); const title = translate(desktop.language, app.title); const t = (en: string, es: string) => translate(desktop.language, [en, es]);
 return <section ref={p.ref} className={`window ${state.minimized ? 'minimized' : ''} ${state.maximized ? 'maximized' : ''} ${focused ? 'focused' : ''}`} data-app={state.id} role="region" aria-label={title} style={{ left: state.left, top: state.top, width: state.width, height: state.height, zIndex: state.z }} onPointerDown={() => desktop.focus(state.id)}><div className="window-bar" onPointerDown={p.startDrag} onPointerMove={p.moveDrag} onPointerUp={p.endDrag} onPointerCancel={p.endDrag} onDoubleClick={p.doubleClick}><div className="window-title"><Icon size={15}/><b>{title}</b></div><div className="window-actions"><button className="minimize" aria-label={t('Minimize', 'Minimizar')} onClick={() => desktop.minimize(state.id)}><Minus size={16}/></button><button className="maximize" aria-label={t('Maximize', 'Maximizar')} onClick={() => desktop.maximize(state.id)}><Square size={16}/></button><button className="close" aria-label={t('Close', 'Cerrar')} onClick={() => desktop.close(state.id)}><X size={16}/></button></div></div><div className="window-content"><View language={desktop.language} openApp={desktop.open} avatarCollection={desktop.avatars} experienceTarget={state.experienceTarget}/></div></section>;
}
