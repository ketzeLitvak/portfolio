import type { Text } from './types';
export interface ExperienceEntry {
  id: string; tab: Text; organization: Text; role: Text; period: Text; summary: Text; logo?: string;
  contributions: { title: Text; description: Text }[];
  skills: string[]; project?: string;
}
export const experiences: ExperienceEntry[] = [
  {
    id: 'geopagos', tab: ['Geopagos', 'Geopagos'], organization: ['Geopagos', 'Geopagos'],
    role: ['Senior Full Stack Developer', 'Desarrollador Full Stack Senior'],
    period: ['February 2022 — Present', 'Febrero 2022 — Actualidad'], logo: './assets/geopagos-logo.jpg',
    summary: ['Contribute to the design and development of Acquirer in a Box, working across internal tools, backend services and payment security.', 'Participo en el diseño y desarrollo de Acquirer in a Box, trabajando en herramientas internas, servicios backend y seguridad de pagos.'],
    contributions: [
      { title: ['Backend & payment security', 'Backend y seguridad de pagos'], description: ['Developed services with C#/.NET and Python, including payment security services supporting MPoC certification requirements.', 'Desarrollé servicios con C#/.NET y Python, incluidos servicios de seguridad de pagos que acompañan los requisitos de certificación MPoC.'] },
      { title: ['Interfaces & access control', 'Interfaces y control de acceso'], description: ['Developed the internal backoffice and React microfrontends with TypeScript. Worked with SpiceDB for authorization and access control across services.', 'Desarrollé el backoffice interno y microfrontends React con TypeScript. Trabajé con SpiceDB para autorización y control de acceso entre servicios.'] },
      { title: ['Quality in the delivery pipeline', 'Calidad en el proceso de entrega'], description: ['Used SonarQube results in CI/CD to review findings and correct issues in the code.', 'Usé los resultados de SonarQube en CI/CD para revisar hallazgos y corregir problemas en el código.'] },
    ],
    skills: ['C#', '.NET', 'Python', 'React', 'TypeScript', 'SpiceDB', 'SonarQube'],
  },
  {
    id: 'utn', tab: ['UTN', 'UTN'], organization: ['UTN Buenos Aires', 'UTN Buenos Aires'],
    role: ['Information Systems Engineering · Teaching assistant', 'Ingeniería en Sistemas · Ayudante de cátedra'],
    period: ['Degree since 2021 · Teaching since February 2023', 'Carrera desde 2021 · Ayudantía desde febrero 2023'], logo: './assets/utn-logo.png',
    summary: ['Final-year Information Systems Engineering student and teaching assistant in Programming Paradigms. Expected graduation: December 2026.', 'Estudiante del último año de Ingeniería en Sistemas de Información y ayudante de Paradigmas de Programación. Graduación estimada: diciembre de 2026.'],
    contributions: [
      { title: ['Teaching & feedback', 'Docencia y acompañamiento'], description: ['Review and assess practical assignments for the second-year Programming Paradigms course, providing feedback on students’ work.', 'Reviso y evalúo trabajos prácticos de Paradigmas de Programación, materia de segundo año, y doy devoluciones sobre el trabajo de los estudiantes.'] },
      { title: ['Engineering in practice', 'Ingeniería aplicada'], description: ['Apply software engineering knowledge in Radix, the team capstone project: a platform for evaluating commercial locations. Built the frontend, a substantial part of the backend and the application design.', 'Aplico conocimientos de ingeniería de software en Radix, el proyecto final en equipo: una plataforma para evaluar ubicaciones comerciales. Desarrollé el frontend, gran parte del backend y el diseño de la aplicación.'] },
    ],
    skills: ['Software engineering', 'Programming paradigms', 'Teaching', 'Teamwork'], project: 'radix',
  },
  {
    id: 'leadership', tab: ['Leadership', 'Liderazgo'], organization: ['Círculo Social Hebreo Argentino', 'Círculo Social Hebreo Argentino'],
    role: ['Youth leadership & nonformal education', 'Liderazgo juvenil y educación no formal'],
    period: ['January 2021 — December 2025', 'Enero 2021 — Diciembre 2025'], logo: './assets/circulo-logo.jpg',
    summary: ['Five years planning and facilitating educational activities for children, combining group leadership, play and learning.', 'Cinco años planificando y coordinando actividades educativas para chicos, combinando conducción de grupos, juego y aprendizaje.'],
    contributions: [
      { title: ['Activities with a purpose', 'Actividades con propósito'], description: ['Planned and facilitated educational activities that promoted teamwork and values through play.', 'Planifiqué y coordiné actividades educativas que promovían el trabajo en equipo y los valores a través del juego.'] },
      { title: ['Working with people', 'Trabajo con personas'], description: ['Developed communication, empathy and group leadership skills through nonformal education and collaboration.', 'Desarrollé habilidades de comunicación, empatía y conducción de grupos a través de la educación no formal y el trabajo con otros.'] },
    ],
    skills: ['Communication', 'Empathy', 'Leadership', 'Activity planning'],
  },
];
export const experienceSkillLabels: Record<string, Text> = {
  'Software engineering': ['Software engineering', 'Ingeniería de software'],
  'Programming paradigms': ['Programming paradigms', 'Paradigmas de programación'],
  Teaching: ['Teaching', 'Docencia'], Teamwork: ['Teamwork', 'Trabajo en equipo'],
  Communication: ['Communication', 'Comunicación'], Empathy: ['Empathy', 'Empatía'],
  Leadership: ['Leadership', 'Liderazgo'], 'Activity planning': ['Activity planning', 'Planificación de actividades'],
};
