import { useTranslation } from 'react-i18next';
import { useTitrePage } from '@/shared/hooks/useTitrePage';

interface Section {
  titre: string;
  texte: string;
}

/** Gabarit des pages légales : un titre et des sections de texte traduites. */
export function PageTexte({ cle }: { cle: 'mentions' | 'confidentialite' }) {
  const { t } = useTranslation('vitrine');
  useTitrePage(t(`${cle}.titre`));
  const brutes = t(`${cle}.sections`, { returnObjects: true });
  const sections = Array.isArray(brutes) ? (brutes as Section[]) : [];
  const maj = t(`${cle}.maj`, { defaultValue: '' });

  return (
    <article className="mx-auto max-w-lecture px-6 py-14 md:py-20">
      <h1 className="text-4xl">{t(`${cle}.titre`)}</h1>
      {maj && <p className="mt-2 text-sm text-encre-douce dark:text-seyes">{maj}</p>}
      {sections.map((section) => (
        <section key={section.titre} className="mt-10">
          <h2 className="text-2xl">{section.titre}</h2>
          <p className="mt-3 text-lg">{section.texte}</p>
        </section>
      ))}
    </article>
  );
}
