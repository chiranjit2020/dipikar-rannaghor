import { PageHeader } from '../components/PageHeader';
import { IconLink } from '../components/icons';
import { resources } from '../content/resources';

const KIND_LABEL = {
  official: 'Official',
  tool: 'Tool',
  reference: 'Reference',
} as const;

export function Resources() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Resources"
        subtitle="Official portal ও tool। নিয়ম/fee পরিবর্তনশীল — সবসময় official source-এ যাচাই করবে।"
      />

      <div className="space-y-3">
        {resources.map((r) => {
          const internal = r.url?.startsWith('#');
          return (
            <a
              key={r.id}
              href={r.url}
              target={internal ? undefined : '_blank'}
              rel={internal ? undefined : 'noreferrer noopener'}
              className="card card-hover block p-4"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-hairline bg-white/[0.03] text-ink-soft">
                  <IconLink className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-medium text-ink">{r.title}</h3>
                    <span className="chip">{KIND_LABEL[r.kind]}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{r.description}</p>
                  {r.verifyNote && (
                    <p className="mt-2 rounded-lg border border-warn/25 bg-warn/[0.08] px-3 py-2 text-xs text-warn">
                      ⚠ {r.verifyNote}
                    </p>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
