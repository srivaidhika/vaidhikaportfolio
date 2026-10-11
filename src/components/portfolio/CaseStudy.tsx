import type { ReactNode } from "react";
import { LINKS } from "./data";

export function CaseStudy({ children, repo }: { children: ReactNode; repo?: string }) {
  return (
    <details className="group mt-8 border-t border-current/20 pt-4">
      <summary className="meta flex cursor-pointer list-none items-center justify-between py-2" data-hover>
        <span>Open case study</span>
        <span className="text-lg transition-transform duration-500 group-open:rotate-45">+</span>
      </summary>
      <div className="grid gap-6 pb-2 pt-4 text-[0.95rem] leading-relaxed opacity-90 md:grid-cols-2">{children}</div>
      <div className="meta mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {repo ? (
          <a href={repo} target="_blank" rel="noreferrer" className="link-underline">GitHub ↗</a>
        ) : (
          <a href={LINKS.github} target="_blank" rel="noreferrer" className="link-underline">
            Repository: not public yet — see GitHub profile ↗
          </a>
        )}
        <span className="opacity-60">Live demo: unavailable</span>
      </div>
    </details>
  );
}

export function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="meta mb-2 opacity-60">{label}</p>
      <div>{children}</div>
    </div>
  );
}
