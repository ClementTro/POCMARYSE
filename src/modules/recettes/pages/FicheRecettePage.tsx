import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, Pencil, Printer, Trash2 } from 'lucide-react';
import { useTitrePage } from '@/shared/hooks/useTitrePage';
import { Button, LienBouton } from '@/shared/ui/Button';
import { Chargement } from '@/shared/ui/Chargement';
import { ErreurChargement } from '@/shared/ui/ErreurChargement';
import { EtatVide } from '@/shared/ui/EtatVide';
import { Fiche } from '@/shared/ui/Fiche';
import { Message } from '@/shared/ui/Message';
import { useCopierRecette, useRecette, useSupprimerRecette } from '../api';
import { BadgeDemo, Etiquettes } from '../components/MetaRecette';
import { formaterDuree } from '../duree';
import { estDemo, formaterQuantite, tempsTotal } from '../recettes';
import type { EtatNavigationRecette, Ingredient, Recette } from '../types';

const LIEN_RETOUR =
  'no-print inline-flex items-center gap-2 font-semibold text-faience hover:underline dark:text-beurre';

function LigneIngredient({ ingredient, langue }: { ingredient: Ingredient; langue: string }) {
  const quantite =
    ingredient.quantity === null
      ? ''
      : [formaterQuantite(ingredient.quantity, langue), ingredient.unit].filter(Boolean).join(' ');
  return (
    <li className="flex gap-3 py-2">
      {quantite && <span className="shrink-0 font-semibold">{quantite}</span>}
      <span>{ingredient.name}</span>
    </li>
  );
}

function Temps({ recette }: { recette: Recette }) {
  const { t } = useTranslation('recettes');
  const elements = [
    { libelle: t('fiche.portions'), valeur: t('carte.portions', { count: recette.servings }) },
    { libelle: t('fiche.preparation'), valeur: formaterDuree(t, recette.prep_minutes) },
    { libelle: t('fiche.cuisson'), valeur: formaterDuree(t, recette.cook_minutes) },
    { libelle: t('fiche.total'), valeur: formaterDuree(t, tempsTotal(recette)) },
    { libelle: t('fiche.difficulte'), valeur: t(`difficultes.${recette.difficulty}`) },
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {elements.map(({ libelle, valeur }) => (
        <div key={libelle} className="rounded-fiche bg-papier-fonce px-3 py-2 dark:bg-nuit">
          <dt className="text-sm text-encre-douce dark:text-seyes">{libelle}</dt>
          <dd className="font-semibold">{valeur}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function FicheRecettePage() {
  const { t, i18n } = useTranslation('recettes');
  const { id } = useParams();
  const navigate = useNavigate();
  const etat = useLocation().state as EtatNavigationRecette | null;
  const { data: recette, isError, refetch } = useRecette(id);
  const copier = useCopierRecette();
  const supprimer = useSupprimerRecette();
  const [confirmation, setConfirmation] = useState(false);
  useTitrePage(recette?.title ?? t('liste.titre'));

  if (recette === undefined) {
    return isError ? <ErreurChargement onReessayer={() => void refetch()} /> : <Chargement />;
  }
  if (!recette) {
    return (
      <EtatVide
        titre={t('fiche.introuvableTitre')}
        texte={t('fiche.introuvableTexte')}
        action={<LienBouton to="..">{t('fiche.retour')}</LienBouton>}
      />
    );
  }

  const demo = estDemo(recette);
  const langue = i18n.resolvedLanguage ?? 'fr';

  const surCopie = () =>
    copier.mutate(recette, {
      onSuccess: (copie) =>
        navigate(`../${copie.id}`, {
          state: { message: 'fiche.copieFaite' } satisfies EtatNavigationRecette,
        }),
    });

  const surSuppression = () =>
    supprimer.mutate(recette.id, { onSuccess: () => navigate('..', { replace: true }) });

  return (
    <div className="flex flex-col gap-6">
      <Link to=".." className={LIEN_RETOUR}>
        <ArrowLeft aria-hidden="true" className="h-5 w-5" />
        {t('fiche.retour')}
      </Link>

      {etat?.message && <Message ton="succes">{t(etat.message)}</Message>}
      {(copier.isError || supprimer.isError) && (
        <Message ton="erreur">{t('erreurs.serveur')}</Message>
      )}

      <Fiche className="flex flex-col gap-6 p-6 sm:p-8">
        <header className="flex flex-col gap-3">
          {demo && (
            <div>
              <BadgeDemo />
            </div>
          )}
          <h1 className="text-4xl">{recette.title}</h1>
          {recette.description && (
            <p className="max-w-lecture text-lg text-encre-douce dark:text-seyes">
              {recette.description}
            </p>
          )}
          <Etiquettes tags={recette.tags} />
        </header>

        <Temps recette={recette} />

        <div className="no-print flex flex-wrap gap-3">
          {demo ? (
            <Button onClick={surCopie} disabled={copier.isPending}>
              <Copy aria-hidden="true" className="h-5 w-5" />
              {t('fiche.copier')}
            </Button>
          ) : (
            <>
              <LienBouton to="modifier">
                <Pencil aria-hidden="true" className="h-5 w-5" />
                {t('fiche.modifier')}
              </LienBouton>
              <Button variante="secondaire" onClick={() => setConfirmation(true)}>
                <Trash2 aria-hidden="true" className="h-5 w-5" />
                {t('fiche.supprimer')}
              </Button>
            </>
          )}
          <Button variante="discret" onClick={() => window.print()}>
            <Printer aria-hidden="true" className="h-5 w-5" />
            {t('fiche.imprimer')}
          </Button>
        </div>

        {confirmation && (
          <div
            role="alertdialog"
            aria-labelledby="confirmation-suppression"
            className="no-print flex flex-col gap-3 rounded-fiche border-2 border-vichy p-4"
          >
            <p id="confirmation-suppression" className="font-semibold">
              {t('fiche.confirmerSuppression', { titre: recette.title })}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variante="danger"
                onClick={surSuppression}
                disabled={supprimer.isPending}
                autoFocus
              >
                {t('fiche.confirmer')}
              </Button>
              <Button variante="discret" onClick={() => setConfirmation(false)}>
                {t('common:actions.annuler')}
              </Button>
            </div>
          </div>
        )}

        {demo && (
          <Message ton="info" className="no-print">
            {t('fiche.demoNote')}
          </Message>
        )}

        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <section aria-labelledby="titre-ingredients">
            <h2 id="titre-ingredients" className="mb-2 text-2xl">
              {t('fiche.ingredients')}
            </h2>
            {recette.ingredients.length ? (
              <ul className="divide-y divide-seyes border-y border-seyes dark:divide-nuit-ligne dark:border-nuit-ligne">
                {recette.ingredients.map((ingredient, index) => (
                  <LigneIngredient key={index} ingredient={ingredient} langue={langue} />
                ))}
              </ul>
            ) : (
              <p className="text-encre-douce dark:text-seyes">{t('fiche.aucunIngredient')}</p>
            )}
          </section>
          <section aria-labelledby="titre-etapes">
            <h2 id="titre-etapes" className="mb-2 text-2xl">
              {t('fiche.etapes')}
            </h2>
            {recette.steps.length ? (
              <ol className="flex flex-col gap-4">
                {recette.steps.map((etape, index) => (
                  <li key={index} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-vichy font-titre text-vichy"
                    >
                      {index + 1}
                    </span>
                    <p className="max-w-lecture pt-0.5">{etape}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-encre-douce dark:text-seyes">{t('fiche.aucuneEtape')}</p>
            )}
          </section>
        </div>
      </Fiche>
    </div>
  );
}
