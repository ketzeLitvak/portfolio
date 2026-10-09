import styles from './PermissionExperimentView.module.css';

import { ExperimentHeader } from '../ExperimentHeader';

import { ExperimentExplanation } from '../ExperimentExplanation';

import {
  ArrowRight,
  Check,
  DoorClosed,
  DoorOpen,
  FileText,
  LockKeyhole,
  Share2,
  UserRound,
  Pencil,
} from 'lucide-react';

import type { ViewProps } from '../../../models/viewProps';

import { translate, type Text } from '../../../models/types';

import {
  permissionUsers,
  permissionDocuments,
  type PermissionAction,
  type PermissionRole,
} from '../../../models/permissionExperiment';

import { usePermissionExperimentPresenter } from '../../../presenters/usePermissionExperimentPresenter';

import { PermissionOptions } from './PermissionOptions';

const roles: { id: PermissionRole; title: Text; description: Text }[] = [
  {
    id: 'none',
    title: ['No access', 'Sin acceso'],
    description: [
      'No relationship with this organization’s readers or editors.',
      'Sin relación con los lectores o editores de esta organización.',
    ],
  },
  {
    id: 'viewer',
    title: ['Reader', 'Lectura'],
    description: [
      'Can view a document from their organization.',
      'Puede ver un documento de su organización.',
    ],
  },
  {
    id: 'editor',
    title: ['Editor', 'Edición'],
    description: ['Can view and edit, but cannot share.', 'Puede ver y editar, pero no compartir.'],
  },
];
const actions: { id: PermissionAction; title: Text; description: Text }[] = [
  {
    id: 'view',
    title: ['View', 'Ver'],
    description: ['Try opening the document.', 'Intentar abrir el documento.'],
  },
  {
    id: 'edit',
    title: ['Edit', 'Editar'],
    description: [
      'Check whether this person can make changes.',
      'Comprobar si esta persona puede hacer cambios.',
    ],
  },
  {
    id: 'share',
    title: ['Share', 'Compartir'],
    description: [
      'In this example, only the owner can share.',
      'En este ejemplo, solo el propietario puede compartir.',
    ],
  },
];

export function PermissionExperimentView({ language }: ViewProps) {
  const p = usePermissionExperimentPresenter(),
    { scenario: s, result: r } = p;

  const t = (text: Text) => translate(language, text);

  const opened = p.attempted && r.allowed;
  const Door = opened ? DoorOpen : DoorClosed;
  const Action = s.action === 'edit' ? Pencil : s.action === 'share' ? Share2 : ArrowRight;
  const owner = permissionUsers.find((user) => user.id === r.document.owner)!;
  const message: Text = p.checking
    ? ['Checking the person’s relationships…', 'Comprobando las relaciones de esta persona…']
    : !p.attempted
      ? [
          'Choose a person and try opening the document. What lets them in?',
          'Elegí una persona e intentá abrir el documento. ¿Qué le permite entrar?',
        ]
      : !r.sameTenant
        ? [
            `${r.user.name} belongs to ${r.user.tenant}, but this document belongs to ${r.document.tenant}. A role does not cross organization boundaries in this example.`,
            `${r.user.name} pertenece a ${r.user.tenant}, pero este documento es de ${r.document.tenant}. En este ejemplo, un rol no permite cruzar de organización.`,
          ]
        : r.allowed
          ? r.owner
            ? [
                `${r.user.name} owns this document and can view, edit and share it.`,
                `${r.user.name} es propietario de este documento y puede verlo, editarlo y compartirlo.`,
              ]
            : r.path === 'editor'
              ? [
                  `${r.user.name} belongs to the editors group. That relationship permits viewing and editing.`,
                  `${r.user.name} pertenece al grupo de editores. Esa relación permite ver y editar.`,
                ]
              : [
                  `${r.user.name} belongs to the readers group. That permits viewing, but not editing or sharing.`,
                  `${r.user.name} pertenece al grupo de lectores. Eso permite ver, pero no editar ni compartir.`,
                ]
          : s.action === 'share'
            ? [
                `Only ${owner.name}, the owner, can share this document.`,
                `Solo ${owner.name}, su propietario, puede compartir este documento.`,
              ]
            : p.role === 'viewer' && s.action === 'edit'
              ? [
                  `${r.user.name} can read this document, but needs an editor relationship to change it.`,
                  `${r.user.name} puede leer este documento, pero necesita la relación de editor para modificarlo.`,
                ]
              : [
                  `${r.user.name} has no relationship that allows this action. Try granting reader or editor access.`,
                  `${r.user.name} no tiene una relación que permita esta acción. Probá darle acceso de lectura o edición.`,
                ];
  return (
    <div className={styles.permissionPlayground}>
      <ExperimentHeader
        language={language}
        appearance="permission"
        title={['What opens the door?', '¿Qué abre la puerta?']}
        description={[
          'The same document, different people. Access depends on their relationships.',
          'El mismo documento, distintas personas. El acceso depende de sus relaciones.',
        ]}
        reset={p.reset}
        disabled={p.checking}
      />
      <div
        className={styles.permissionPeople}
        role="group"
        aria-label={t(['Choose a person', 'Elegir persona'])}
      >
        {permissionUsers.map((user) => (
          <button
            key={user.id}
            data-person={user.id}
            aria-pressed={s.user === user.id}
            onClick={() => p.update({ user: user.id })}
            disabled={p.checking}
          >
            <UserRound size={15} />
            <span>
              {user.name}
              <small>{user.tenant}</small>
            </span>
          </button>
        ))}
      </div>
      <div
        className={styles.permissionScene}
        data-result={
          p.checking ? 'checking' : !p.attempted ? 'idle' : opened ? 'allowed' : 'denied'
        }
      >
        <article className={styles.permissionPerson}>
          <span className={styles.permissionAvatar}>
            <UserRound size={38} />
          </span>
          <h3>{r.user.name}</h3>
          <span className={styles.permissionOrganization}>{r.user.tenant}</span>
          <small>{t(['Relationship', 'Relación'])}</small>
          {p.role === 'owner' ? (
            <span className={styles.permissionOwner}>{t(['Owner', 'Propietario'])}</span>
          ) : (
            <PermissionOptions
              language={language}
              label={[
                'Relationship in this document’s organization',
                'Relación en la organización del documento',
              ]}
              value={p.role}
              options={roles}
              onChange={p.setRole}
              disabled={p.checking}
            />
          )}
          <ArrowRight className={styles.permissionConnection} size={19} />
        </article>
        <article className={styles.permissionDoor}>
          <span className={styles.permissionDoorIcon}>
            <Door size={76} strokeWidth={1.3} />
          </span>
          <strong>
            {t(
              p.checking
                ? ['Checking…', 'Comprobando…']
                : !p.attempted
                  ? ['Ready to try', 'Listo para probar']
                  : opened
                    ? ['Access granted', 'Acceso permitido']
                    : ['Access denied', 'Acceso bloqueado'],
            )}
          </strong>
          <small>
            {t(
              !p.attempted
                ? ['A relationship is the key', 'La relación es la llave']
                : opened
                  ? ['The relationship grants this action', 'La relación permite esta acción']
                  : ['This action has no valid permission', 'Esta acción no tiene permiso válido'],
            )}
          </small>
          <ArrowRight className={styles.permissionConnection} size={19} />
        </article>
        <article className={styles.permissionDocument}>
          <span className={styles.permissionDocumentIcon}>
            <FileText size={25} />
          </span>
          <h3>{t(r.document.title)}</h3>
          <span className={styles.permissionOrganization}>{r.document.tenant}</span>
          <small>
            {t(['Owner', 'Propietario'])}: {owner.name}
          </small>
          <div className={styles.permissionDocumentPreview} data-open={opened}>
            {opened ? (
              <>
                <Check size={17} />
                <strong>
                  {t(
                    s.action === 'edit'
                      ? ['Editing allowed', 'Edición permitida']
                      : s.action === 'share'
                        ? ['Sharing allowed', 'Compartir permitido']
                        : ['You can read it', 'Podés leerlo'],
                  )}
                </strong>
                <span className={styles.permissionPaperLine} />
                <span className={styles.permissionPaperLine} />
              </>
            ) : (
              <>
                <LockKeyhole size={22} />
                <span>{t(['Protected document', 'Documento protegido'])}</span>
              </>
            )}
          </div>
        </article>
      </div>
      <div
        className={styles.permissionFeedback}
        data-result={p.attempted ? (opened ? 'allowed' : 'denied') : 'idle'}
        aria-live="polite"
        aria-atomic="true"
      >
        <span className={p.checking ? styles.permissionPulse : styles.permissionDot} />
        <p>{t(message)}</p>
      </div>
      <div className={styles.permissionMainAction}>
        <button className={styles.permissionAttempt} onClick={p.attempt} disabled={p.checking}>
          <Action size={17} />
          {t(
            p.checking
              ? ['Checking access…', 'Comprobando acceso…']
              : s.action === 'view'
                ? ['Open document', 'Abrir documento']
                : s.action === 'edit'
                  ? ['Try editing', 'Intentar editar']
                  : ['Try sharing', 'Intentar compartir'],
          )}
        </button>
        <PermissionOptions
          language={language}
          label={['Action to try', 'Acción a probar']}
          value={s.action}
          options={actions}
          onChange={(action) => p.update({ action })}
          disabled={p.checking}
        />
      </div>
      <footer className={styles.permissionFooter}>
        {t(['Local demo · sample documents', 'Demo local · documentos de ejemplo'])}
      </footer>
      <ExperimentExplanation language={language} appearance="permission">
        <p>
          {t([
            'A permission comes from a relationship: person → readers or editors → document. The owner has a direct relationship. In this example, the organization boundary is checked first.',
            'Un permiso surge de una relación: persona → lectores o editores → documento. El propietario tiene una relación directa. En este ejemplo se verifica primero el límite entre organizaciones.',
          ])}
        </p>
        <ul>
          <li>{t(['Readers can view.', 'Los lectores pueden ver.'])}</li>
          <li>{t(['Editors can view and edit.', 'Los editores pueden ver y editar.'])}</li>
          <li>{t(['Only the owner can share.', 'Solo el propietario puede compartir.'])}</li>
        </ul>
        <label>
          {t(['Try another document', 'Probar otro documento'])}
          <select
            value={s.document}
            disabled={p.checking}
            onChange={(event) => p.update({ document: event.target.value })}
          >
            {permissionDocuments.map((document) => (
              <option key={document.id} value={document.id}>
                {t(document.title)} · {document.tenant}
              </option>
            ))}
          </select>
        </label>
        <p>
          {t([
            'Changing a relationship changes the next access check. Being an editor does not bypass the organization boundary. This is one illustrative policy inspired by SpiceDB; it does not connect to a server.',
            'Cambiar una relación cambia la próxima comprobación. Ser editor no evita el límite de organización. Es una política de ejemplo inspirada en SpiceDB; no se conecta a un servidor.',
          ])}
        </p>
        <a
          href="https://authzed.com/docs/spicedb/modeling/developing-a-schema"
          target="_blank"
          rel="noreferrer"
        >
          {t(['Explore relationship-based permissions', 'Explorar permisos por relaciones'])} →
        </a>
      </ExperimentExplanation>
    </div>
  );
}
