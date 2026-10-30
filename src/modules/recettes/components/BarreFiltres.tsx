import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { ChampListe, ChampTexte } from '@/shared/ui/Champ';
import {
  DIFFICULTES,
  ORIGINES,
  TEMPS_MAX_PROPOSES,
  type Difficulte,
  type FiltresRecettes,
  type Origine,
} from '../types';

interface BarreFiltresProps {
  filtres: FiltresRecettes;
  tags: string[];
  onChange: (filtres: FiltresRecettes) => void;
}

export function BarreFiltres({ filtres, tags, onChange }: BarreFiltresProps) {
  const { t } = useTranslation('recettes');
  const modifier = (partiel: Partial<FiltresRecettes>) => onChange({ ...filtres, ...partiel });

  return (
    <form
      role="search"
      aria-label={t('filtres.titre')}
      onSubmit={(e) => e.preventDefault()}
      className="grid gap-4 rounded-fiche bg-papier-fonce p-4 dark:bg-nuit-carte sm:grid-cols-2 lg:grid-cols-[2fr_repeat(4,1fr)]"
    >
      <div className="relative sm:col-span-2 lg:col-span-1">
        <ChampTexte
          label={t('filtres.recherche')}
          type="search"
          placeholder={t('filtres.recherchePlaceholder')}
          value={filtres.texte}
          onChange={(e) => modifier({ texte: e.target.value })}
          className="pl-10"
        />
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 text-encre-douce dark:text-seyes"
        />
      </div>
      <ChampListe
        label={t('filtres.etiquette')}
        value={filtres.tag}
        onChange={(e) => modifier({ tag: e.target.value })}
      >
        <option value="">{t('filtres.toutes')}</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </ChampListe>
      <ChampListe
        label={t('filtres.temps')}
        value={filtres.tempsMax ?? ''}
        onChange={(e) => modifier({ tempsMax: e.target.value ? Number(e.target.value) : null })}
      >
        <option value="">{t('filtres.sansLimite')}</option>
        {TEMPS_MAX_PROPOSES.map((minutes) => (
          <option key={minutes} value={minutes}>
            {t('filtres.tempsMax', { minutes })}
          </option>
        ))}
      </ChampListe>
      <ChampListe
        label={t('filtres.difficulte')}
        value={filtres.difficulte}
        onChange={(e) => modifier({ difficulte: e.target.value as Difficulte | '' })}
      >
        <option value="">{t('filtres.toutes')}</option>
        {DIFFICULTES.map((difficulte) => (
          <option key={difficulte} value={difficulte}>
            {t(`difficultes.${difficulte}`)}
          </option>
        ))}
      </ChampListe>
      <ChampListe
        label={t('filtres.origine')}
        value={filtres.origine}
        onChange={(e) => modifier({ origine: e.target.value as Origine })}
      >
        {ORIGINES.map((origine) => (
          <option key={origine} value={origine}>
            {t(`filtres.origines.${origine}`)}
          </option>
        ))}
      </ChampListe>
    </form>
  );
}
