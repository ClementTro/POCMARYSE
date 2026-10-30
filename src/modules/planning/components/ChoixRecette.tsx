import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { ChampTexte } from '@/shared/ui/Champ';
import { filtrerParTitre } from '../recherche';
import type { RecettePlanifiable } from '../types';

interface ChoixRecetteProps {
  libelleCase: string;
  recettes: RecettePlanifiable[];
  onChoisir: (recette: RecettePlanifiable) => void;
  onFermer: () => void;
}

/** Alternative au glisser-déposer : choisir la recette d'une case dans une liste (clavier, mobile). */
export function ChoixRecette({ libelleCase, recettes, onChoisir, onFermer }: ChoixRecetteProps) {
  const { t } = useTranslation('planning');
  const dialogue = useRef<HTMLDialogElement>(null);
  const [recherche, setRecherche] = useState('');
  const visibles = filtrerParTitre(recettes, recherche);

  useEffect(() => {
    const element = dialogue.current;
    if (!element) return;
    if (element.open) return;
    // Pas de close() au démontage : l'événement `close` rappellerait onFermer (double montage
    // de StrictMode) ; retirer le <dialog> du DOM suffit à le fermer.
    if (typeof element.showModal === 'function') element.showModal();
    else element.setAttribute('open', '');
    element.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
  }, []);

  return (
    <dialog
      ref={dialogue}
      aria-labelledby="titre-choix"
      aria-describedby="pour-choix"
      onClose={onFermer}
      onClick={(e) => {
        if (e.target === e.currentTarget) onFermer();
      }}
      className="w-[min(32rem,calc(100vw-2rem))] rounded-fiche border-t-[3px] border-vichy bg-papier p-0 text-encre shadow-fiche backdrop:bg-encre/40 dark:bg-nuit-carte dark:text-papier"
    >
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="titre-choix" className="text-2xl">
              {t('choix.titre')}
            </h2>
            <p id="pour-choix" className="text-encre-douce dark:text-seyes">
              {t('choix.pour', { case: libelleCase })}
            </p>
          </div>
          <Button variante="icone" onClick={onFermer} aria-label={t('choix.fermer')}>
            <X aria-hidden="true" className="h-5 w-5" />
          </Button>
        </div>
        <ChampTexte
          label={t('choix.recherche')}
          type="search"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
        {recettes.length === 0 ? (
          <p className="text-encre-douce dark:text-seyes">{t('bac.vide')}</p>
        ) : visibles.length === 0 ? (
          <p className="text-encre-douce dark:text-seyes">{t('bac.aucune')}</p>
        ) : (
          <ul className="flex max-h-80 flex-col gap-1 overflow-y-auto">
            {visibles.map((recette) => (
              <li key={recette.id}>
                <button
                  type="button"
                  onClick={() => onChoisir(recette)}
                  className="min-h-11 w-full rounded-bouton px-3 py-2 text-left font-semibold hover:bg-faience-clair dark:hover:bg-nuit"
                >
                  {recette.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </dialog>
  );
}
