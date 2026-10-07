export type Theme = 'dark' | 'light' | 'auto';
export type Language = 'en' | 'es';
export type Text = readonly [string, string];
export interface Project { title: string; logo?: string; color: string; symbol: string; subtitle: Text; role: Text; description: Text; contribution: Text; stack: string[]; url?: string; status?: Text; extra?: string; }
export interface ExperienceTarget { id: string; revision: number; }
export interface AppOpenOptions { experience?: string; }
export interface WindowState { experienceTarget?: ExperienceTarget; id: string; left: number; top: number; width: number; height: number; z: number; minimized: boolean; maximized: boolean; }
export const translate = (language: Language, text: Text) => text[language === 'es' ? 1 : 0];
export function readPreference(key: string, fallback: string): string { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } }
export function savePreference(key: string, value: string) { try { localStorage.setItem(key, value); } catch { /* Storage can be unavailable in private contexts. */ } }
