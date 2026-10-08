import { ShieldCheck, ShieldX } from 'lucide-react';
import type { ViewProps } from '../../models/viewProps';
import { translate, type Text } from '../../models/types';
import {
  permissionUsers,
  permissionDocuments,
  type PermissionAction,
} from '../../models/permissionExperiment';
import { usePermissionExperimentPresenter } from '../../presenters/usePermissionExperimentPresenter';
import { ExperimentShell } from './ExperimentShell';
export function PermissionExperimentView({ language }: ViewProps) {
  const p = usePermissionExperimentPresenter(),
    { scenario: s, result: r } = p;
  const t = (text: Text) => translate(language, text);
  const ResultIcon = r.allowed ? ShieldCheck : ShieldX;
  return (
    <ExperimentShell
      language={language}
      title={['Who can do what?', '¿Quién puede hacer qué?']}
      description={[
        'Explore relationship-based permissions and organization boundaries. Inspired by SpiceDB; evaluated locally.',
        'Explorá permisos por relaciones y límites entre organizaciones. Inspirado en SpiceDB; evaluado localmente.',
      ]}
      docs="https://authzed.com/docs/spicedb/modeling/developing-a-schema"
      reset={p.reset}
    >
      <div className="experiment-controls">
        <label>
          {t(['Person', 'Persona'])}
          <select value={s.user} onChange={(e) => p.update({ user: e.target.value })}>
            {permissionUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} · {u.tenant}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t(['Document', 'Documento'])}
          <select value={s.document} onChange={(e) => p.update({ document: e.target.value })}>
            {permissionDocuments.map((d) => (
              <option key={d.id} value={d.id}>
                {t(d.title)} · {d.tenant}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t(['Action', 'Acción'])}
          <select
            value={s.action}
            onChange={(e) => p.update({ action: e.target.value as PermissionAction })}
          >
            <option value="view">{t(['View', 'Ver'])}</option>
            <option value="edit">{t(['Edit', 'Editar'])}</option>
            <option value="share">{t(['Share', 'Compartir'])}</option>
          </select>
        </label>
      </div>
      <div className="experiment-checks">
        <label>
          <input type="checkbox" checked={r.editor} onChange={() => p.toggle('editors')} />
          {t(['Member of editors', 'Miembro de editores'])}
        </label>
        <label>
          <input type="checkbox" checked={r.viewer} onChange={() => p.toggle('viewers')} />
          {t(['Member of readers', 'Miembro de lectores'])}
        </label>
      </div>
      <svg
        className="permission-graph"
        viewBox="0 0 540 240"
        role="img"
        aria-label={t(['Permission relationship graph', 'Grafo de relaciones de permisos'])}
      >
        {[
          {
            y: 65,
            name: t(['Editors', 'Editores']),
            active: r.path === 'editor',
            member: r.editor,
          },
          {
            y: 165,
            name: t(['Readers', 'Lectores']),
            active: r.path === 'viewer',
            member: r.viewer,
          },
        ].map((node) => (
          <g key={node.y} className={node.active ? 'graph-active' : ''}>
            <path
              d={`M120 120 L210 ${node.y} M330 ${node.y} L420 120`}
              className={node.member ? 'graph-member' : 'graph-empty'}
            />
            <rect x="210" y={node.y - 25} width="120" height="50" rx="12" />
            <text x="270" y={node.y + 5}>
              {node.name}
            </text>
          </g>
        ))}
        <path
          d="M120 120 Q270 280 420 120"
          className={r.path === 'owner' ? 'graph-owner graph-active' : 'graph-empty'}
        />
        <rect x="10" y="90" width="110" height="60" rx="12" />
        <text x="65" y="115">
          {r.user.name}
        </text>
        <text x="65" y="136" className="graph-caption">
          {r.user.tenant}
        </text>
        <rect x="420" y="90" width="110" height="60" rx="12" />
        <text x="475" y="115">
          {t(['Document', 'Documento'])}
        </text>
        <text x="475" y="136" className="graph-caption">
          {r.document.tenant}
        </text>
        <text x="270" y="228" className="graph-caption">
          {t(['Owner', 'Propietario'])}: {r.document.owner}
        </text>
      </svg>
      <div className="experiment-result" data-success={r.allowed}>
        <ResultIcon size={24} />
        <div>
          <strong>{t(r.allowed ? ['Allowed', 'Permitido'] : ['Denied', 'Denegado'])}</strong>
          <p>{t(r.reason)}</p>
        </div>
      </div>
    </ExperimentShell>
  );
}
