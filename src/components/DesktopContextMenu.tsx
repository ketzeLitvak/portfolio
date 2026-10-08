import type { ContextMenuPresenter } from '../presenters/useContextMenuPresenter';

export function DesktopContextMenu({ presenter: p }: { presenter: ContextMenuPresenter }) {
  if (!p.menu) return null;
  return (
    <div
      ref={p.ref}
      className="desktop-context-menu"
      role="menu"
      aria-label={p.menu.title}
      style={{ left: p.menu.x, top: p.menu.y }}
      onKeyDown={p.navigate}
      onContextMenu={(event) => event.preventDefault()}
    >
      <p>{p.menu.title}</p>
      {p.menu.actions.map((action) => {
        const Icon = action.icon;
        const content = (
          <>
            <Icon size={16} />
            <span>{action.label}</span>
          </>
        );
        return action.href ? (
          <a
            key={action.label}
            role="menuitem"
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={p.dismiss}
          >
            {content}
          </a>
        ) : (
          <button
            key={action.label}
            role="menuitem"
            disabled={action.disabled}
            onClick={() => {
              p.dismiss();
              action.run?.();
            }}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
