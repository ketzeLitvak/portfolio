import type { Text } from './types';

export const permissionUsers = [
  { id: 'ana', name: 'Ana', tenant: 'atlas' },
  { id: 'bruno', name: 'Bruno', tenant: 'atlas' },
  { id: 'carla', name: 'Carla', tenant: 'nova' },
] as const;
export const permissionDocuments = [
  {
    id: 'guide',
    title: ['Product guide', 'Guía de producto'] as Text,
    tenant: 'atlas',
    owner: 'bruno',
  },
  {
    id: 'report',
    title: ['Quarterly report', 'Informe trimestral'] as Text,
    tenant: 'nova',
    owner: 'carla',
  },
];
export type PermissionAction = 'view' | 'edit' | 'share';
export interface PermissionScenario {
  user: string;
  document: string;
  action: PermissionAction;
  editors: string[];
  viewers: string[];
}

export const initialPermissionScenario = (): PermissionScenario => ({
  user: 'ana',
  document: 'guide',
  action: 'view',
  editors: [],
  viewers: ['atlas:ana'],
});

export function evaluatePermission(scenario: PermissionScenario) {
  const user = permissionUsers.find((entry) => entry.id === scenario.user)!;
  const document = permissionDocuments.find((entry) => entry.id === scenario.document)!;
  const sameTenant = user.tenant === document.tenant;
  const owner = user.id === document.owner;
  const editor =
    scenario.editors.includes(`${document.tenant}:${user.id}`) ||
    (document.tenant === 'atlas' && scenario.editors.includes(user.id));
  const viewer =
    scenario.viewers.includes(`${document.tenant}:${user.id}`) ||
    (document.tenant === 'atlas' && scenario.viewers.includes(user.id));
  const path = !sameTenant
    ? 'tenant'
    : owner
      ? 'owner'
      : scenario.action !== 'share' && editor
        ? 'editor'
        : scenario.action === 'view' && viewer
          ? 'viewer'
          : 'none';
  const allowed = path === 'owner' || path === 'editor' || path === 'viewer';
  const reason: Text =
    path === 'tenant'
      ? [
          'The user and document belong to different organizations. This scenario denies access across tenants.',
          'La persona y el documento pertenecen a organizaciones distintas. Este escenario impide el acceso entre tenants.',
        ]
      : path === 'owner'
        ? [
            'The document owner can view, edit and share it.',
            'El propietario del documento puede verlo, editarlo y compartirlo.',
          ]
        : path === 'editor'
          ? [
              'Membership in the document organization’s editors group grants viewing and editing.',
              'Pertenecer al grupo de editores de la organización del documento permite verlo y editarlo.',
            ]
          : path === 'viewer'
            ? [
                'Membership in the viewers group grants viewing, but does not grant editing or sharing.',
                'Pertenecer al grupo de lectores permite ver, pero no editar ni compartir.',
              ]
            : [
                'No relationship grants this action. Sharing is reserved for the owner.',
                'Ninguna relación permite esta acción. Compartir está reservado al propietario.',
              ];
  return { user, document, sameTenant, owner, editor, viewer, path, allowed, reason };
}

export type PermissionRole = 'none' | 'viewer' | 'editor';

export function assignPermissionRole(
  scenario: PermissionScenario,
  role: PermissionRole,
): PermissionScenario {
  const result = evaluatePermission(scenario);
  const key = `${result.document.tenant}:${scenario.user}`;

  const remove = (entries: string[]) =>
    entries.filter(
      (entry) => entry !== key && !(result.document.tenant === 'atlas' && entry === scenario.user),
    );

  return {
    ...scenario,
    editors: [...remove(scenario.editors), ...(role === 'editor' ? [key] : [])],
    viewers: [...remove(scenario.viewers), ...(role === 'viewer' ? [key] : [])],
  };
}
