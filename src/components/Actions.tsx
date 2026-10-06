import { ArrowUpRight, ArrowRight } from 'lucide-react';
export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) { return <a className="btn" href={href} target="_blank" rel="noopener">{children}<ArrowUpRight size={14}/></a>; }
export function OpenButton({ id, openApp, children, primary = false }: { id: string; openApp: (id: string) => void; children: React.ReactNode; primary?: boolean }) { return <button className={`btn ${primary ? 'primary' : ''}`} data-open={id} onClick={() => openApp(id)}>{children}<ArrowRight size={14}/></button>; }
