import { RateExperimentView } from '../views/experiments/rate/RateExperimentView';

import { IndexExperimentView } from '../views/experiments/indexes/IndexExperimentView';

import { SourcingExperimentView } from '../views/experiments/sourcing/SourcingExperimentView';

import { HashExperimentView } from '../views/experiments/hashing/HashExperimentView';

import { EncryptionExperimentView } from '../views/experiments/encryption/EncryptionExperimentView';

import { SignatureExperimentView } from '../views/experiments/signatures/SignatureExperimentView';

import { CircuitExperimentView } from '../views/experiments/circuit/CircuitExperimentView';

import { RaceExperimentView } from '../views/experiments/race/RaceExperimentView';

import { PermissionExperimentView } from '../views/experiments/permissions/PermissionExperimentView';

import { CacheExperimentView } from '../views/experiments/cache/CacheExperimentView';

import { QueueExperimentView } from '../views/experiments/events/QueueExperimentView';

import { projectIcons } from './projectIcons';

import {
  Gauge,
  ListOrdered,
  History,
  Fingerprint,
  LockKeyhole,
  FileSignature,
  Unplug,
  GitFork,
  ShieldCheck,
  DatabaseZap,
  Workflow,
  ArrowUpRight,
  FolderOpen,
  UserRound,
  Smile,
  Braces,
  Mail,
  LayoutGrid,
  Search,
  BriefcaseBusiness,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

import type { ComponentType } from 'react';

import type { Text } from './types';

import type { ViewProps } from './viewProps';

import { projects } from './projects';

import { ProjectSearchView } from '../views/search/ProjectSearchView';

import { ExperienceView } from '../views/experience/ExperienceView';

import { WelcomeView } from '../views/welcome/WelcomeView';

import { ProjectListView } from '../views/projects/ProjectListView';

import { ProjectDetailView } from '../views/projects/ProjectDetailView';

import { ProfileView } from '../views/profile/ProfileView';

import { ContactView } from '../views/contact/ContactView';

import { QuickView } from '../views/quick/QuickView';

import { AvatarView } from '../views/avatar/AvatarView';

import { ToolsView } from '../views/tools/ToolsView';

export interface AppDefinition {
  title: Text;
  icon: LucideIcon;
  view: ComponentType<ViewProps>;
  launcher?: boolean;
  experiment?: boolean;
}
export const appRegistry: Record<string, AppDefinition> = {
  permissions: {
    title: ['Permissions', 'Permisos'],
    icon: ShieldCheck,
    view: PermissionExperimentView,
    experiment: true,
  },
  cache: {
    title: ['Cache', 'Caché'],
    icon: DatabaseZap,
    view: CacheExperimentView,
    experiment: true,
  },
  queues: {
    title: ['Events', 'Eventos'],
    icon: Workflow,
    view: QueueExperimentView,
    experiment: true,
  },
  race: {
    title: ['Race conditions', 'Concurrencia'],
    icon: GitFork,
    view: RaceExperimentView,
    experiment: true,
  },
  circuit: {
    title: ['Circuit breaker', 'Circuit breaker'],
    icon: Unplug,
    view: CircuitExperimentView,
    experiment: true,
  },
  rate: {
    title: ['Rate limiting', 'Rate limiting'],
    icon: Gauge,
    view: RateExperimentView,
    experiment: true,
  },
  indexes: {
    title: ['Database indexes', 'Índices'],
    icon: ListOrdered,
    view: IndexExperimentView,
    experiment: true,
  },
  sourcing: {
    title: ['Event sourcing', 'Event sourcing'],
    icon: History,
    view: SourcingExperimentView,
    experiment: true,
  },
  hashing: {
    title: ['Hashing', 'Hashing'],
    icon: Fingerprint,
    view: HashExperimentView,
    experiment: true,
  },
  encryption: {
    title: ['Encryption', 'Cifrado'],
    icon: LockKeyhole,
    view: EncryptionExperimentView,
    experiment: true,
  },
  signatures: {
    title: ['Digital signatures', 'Firmas digitales'],
    icon: FileSignature,
    view: SignatureExperimentView,
    experiment: true,
  },
  welcome: {
    title: ['Start here', 'Empezá acá'],
    icon: ArrowUpRight,
    view: WelcomeView,
    launcher: true,
  },
  search: { title: ['Search', 'Buscador'], icon: Search, view: ProjectSearchView, launcher: true },
  projects: {
    title: ['Projects', 'Proyectos'],
    icon: FolderOpen,
    view: ProjectListView,
    launcher: true,
  },
  profile: { title: ['About me', 'Sobre mí'], icon: UserRound, view: ProfileView, launcher: true },
  experience: {
    title: ['Experience', 'Experiencia'],
    icon: BriefcaseBusiness,
    view: ExperienceView,
    launcher: true,
  },
  avatar: { title: ['Avatar lab', 'Avatar lab'], icon: Smile, view: AvatarView, launcher: true },
  tools: { title: ['Ketze Tools', 'Ketze Tools'], icon: Braces, view: ToolsView, launcher: true },
  contact: { title: ['Let’s talk', 'Hablemos'], icon: Mail, view: ContactView, launcher: true },
  quick: { title: ['Quick view', 'Vista rápida'], icon: LayoutGrid, view: QuickView },
  ...Object.fromEntries(
    Object.entries(projects).map(([id, project]) => [
      id,
      {
        title: [project.title, project.title] as Text,
        icon: projectIcons[id],
        view: (props: ViewProps) => <ProjectDetailView {...props} id={id} />,
      },
    ]),
  ),
};
export const launcherApps = Object.entries(appRegistry).filter(([, app]) => app.launcher);
