import { X } from 'lucide-react';
import { translate, type Language } from '../models/types';
import type { ShareLinkPresenter } from '../presenters/useShareLinkPresenter';
export function ShareLinkFeedback({
  presenter: p,
  language,
}: {
  presenter: ShareLinkPresenter;
  language: Language;
}) {
  return (
    <>
      {p.message && (
        <div className="share-link-toast" role="status">
          {p.message}
        </div>
      )}
      {p.manualLink && (
        <div
          className="share-link-fallback"
          role="dialog"
          aria-labelledby="share-link-heading"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              event.stopPropagation();
              p.dismiss();
            }
          }}
        >
          <button aria-label={translate(language, ['Close', 'Cerrar'])} onClick={p.dismiss}>
            <X size={16} />
          </button>
          <label id="share-link-heading" htmlFor="share-link-value">
            {translate(language, ['Select and copy this link', 'Seleccioná y copiá este enlace'])}
          </label>
          <input
            ref={p.inputRef}
            id="share-link-value"
            value={p.manualLink}
            readOnly
            onFocus={(event) => event.currentTarget.select()}
          />
        </div>
      )}
    </>
  );
}
