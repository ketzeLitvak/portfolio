import styles from './DesktopWindow.module.css';

import { classNames } from '../../../utils/classNames';

import { WindowTitleBar } from './WindowTitleBar';

import type { WindowState } from '../../../models/types';

import { translate } from '../../../models/types';

import { appRegistry } from '../../../models/appRegistry';

import type { DesktopPresenter } from '../../../presenters/useDesktopPresenter';

import { useWindowPresenter } from '../../../presenters/useWindowPresenter';

export function DesktopWindow({
  state,
  desktop,
  focused,
}: {
  state: WindowState;
  desktop: DesktopPresenter;
  focused: boolean;
}) {
  const app = appRegistry[state.id];
  const Icon = app.icon;
  const View = app.view;
  const p = useWindowPresenter(state, desktop);
  const title = translate(desktop.language, app.title);
  return (
    <section
      ref={p.ref}
      className={classNames(
        styles.window,
        state.minimized ? styles.minimized : '',
        state.maximized ? styles.maximized : '',
        focused ? styles.focused : '',
      )}
      data-app={state.id}
      tabIndex={-1}
      role="region"
      aria-label={title}
      style={{
        left: state.left,
        top: state.top,
        width: state.width,
        height: state.height,
        zIndex: state.z,
      }}
      onPointerDown={() => desktop.focus(state.id)}
    >
      <WindowTitleBar state={state} desktop={desktop} title={title} icon={Icon} drag={p} />
      <div className={styles.windowContent}>
        <View
          language={desktop.language}
          openApp={desktop.open}
          avatarCollection={desktop.avatars}
          experienceTarget={state.experienceTarget}
          onExperienceChange={desktop.selectExperience}
        />
      </div>
    </section>
  );
}
