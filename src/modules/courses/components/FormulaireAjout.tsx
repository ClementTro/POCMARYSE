import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { ChampTexte } from '@/shared/ui/Champ';
import { lireSaisie } from '../liste';
import { LONGUEUR_MAX_NOM, type ArticleSaisi } from '../types';

/** Saisie rapide en une ligne (« 2 kg de pommes ») ; le champ reste actif pour enchaîner. */
export function FormulaireAjout({ onAjouter }: { onAjouter: (article: ArticleSaisi) => void }) {
  const { t } = useTranslation('courses');
  const [texte, setTexte] = useState('');
  const [erreur, setErreur] = useState<string>();

  const surEnvoi = (evenement: FormEvent) => {
    evenement.preventDefault();
    const article = lireSaisie(texte);
    if (!article) {
      setErreur(t('ajout.vide'));
      return;
    }
    onAjouter(article);
    setTexte('');
  };

  return (
    <form onSubmit={surEnvoi} noValidate className="no-print flex items-start gap-2">
      <ChampTexte
        label={t('ajout.libelle')}
        placeholder={t('ajout.exemple')}
        aide={t('ajout.aide')}
        erreur={erreur}
        value={texte}
        onChange={(evenement) => {
          setTexte(evenement.target.value);
          setErreur(undefined);
        }}
        maxLength={LONGUEUR_MAX_NOM + 20}
        autoComplete="off"
        enterKeyHint="done"
        classeCadre="min-w-0 flex-1"
      />
      {/* Aligné sur le champ, sous son libellé (hauteur de ligne + espacement du cadre). */}
      <Button type="submit" className="mt-[1.875rem] px-4">
        <Plus aria-hidden="true" className="h-5 w-5" />
        {t('ajout.bouton')}
      </Button>
    </form>
  );
}
