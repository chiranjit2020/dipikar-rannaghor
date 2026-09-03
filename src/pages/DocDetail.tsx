import { Link, Navigate, useParams } from 'react-router-dom';

import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { PhaseBadge, Tag } from '../components/badges';
import { IconArrowLeft } from '../components/icons';
import { docBySlug, documents } from '../content/documents';
import { phaseById } from '../content/phases';
import { taskSeeds } from '../content/todos';
import { useStore } from '../lib/store';

export function DocDetail() {
  const { slug = '' } = useParams();
  const doc = docBySlug[slug];
  const { docProgress, setDocRead } = useStore();

  if (!doc) return <Navigate to="/docs" replace />;

  const isRead = !!docProgress[doc.id]?.read;
  const related = (doc.relatedDocs ?? []).map((id) => documents.find((d) => d.id === id)).filter(Boolean);
  const relatedTasks = (doc.relatedTasks ?? [])
    .map((id) => taskSeeds.find((t) => t.id === id))
    .filter(Boolean);

  return (
    <article className="space-y-6">
      <Link to="/docs" className="btn-subtle -ml-2 px-2 text-sm">
        <IconArrowLeft className="h-4 w-4" /> Documentation
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <PhaseBadge code={phaseById[doc.phase]?.code ?? doc.phase} />
          <span className="chip">{doc.category}</span>
          <span className="chip">{doc.difficulty}</span>
          <span className="chip">{doc.readingMinutes} min read</span>
        </div>
        <h1 className="text-3xl leading-tight">{doc.title}</h1>
        <p className="text-lg text-ink-soft">{doc.summary}</p>

        <button
          onClick={() => void setDocRead(doc.id, !isRead)}
          className={isRead ? 'btn-ghost' : 'btn-primary'}
        >
          {isRead ? '✓ Marked as read — undo' : 'Mark as read'}
        </button>
      </header>

      <hr className="border-hairline" />

      <MarkdownRenderer content={doc.content} />

      {doc.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2">
          {doc.tags.map((t) => (
            <Tag key={t} label={`#${t}`} />
          ))}
        </div>
      )}

      {relatedTasks.length > 0 && (
        <section className="card p-5">
          <p className="section-title mb-3">এই অধ্যায়ের TODO</p>
          <ul className="space-y-2">
            {relatedTasks.map((t) => (
              <li key={t!.id}>
                <Link to={`/todo#${t!.id}`} className="flex items-start gap-2 text-sm text-ink-soft hover:text-ink">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron/70" />
                  {t!.task}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section>
          <p className="section-title mb-3">Related topics</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((d) => (
              <Link key={d!.id} to={`/docs/${d!.slug}`} className="card card-hover p-4">
                <h3 className="text-sm font-medium text-ink">{d!.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{d!.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
