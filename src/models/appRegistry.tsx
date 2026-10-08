import { projectIcons } from './projectIcons';
import {
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
import { ProjectSearchView } from '../views/ProjectSearchView';
import { ExperienceView } from '../views/ExperienceView';
import { WelcomeView } from '../views/WelcomeView';
import { ProjectListView, ProjectDetailView } from '../views/ProjectViews';
import { ProfileView, ContactView, QuickView } from '../views/ProfileViews';
import { AvatarView, ToolsView } from '../views/PlaygroundViews';
export interface AppDefinition {
  title: Text;
  icon: LucideIcon;
  view: ComponentType<ViewProps>;
  launcher?: boolean;
}
export const appRegistry: Record<string, AppDefinition> = {
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
