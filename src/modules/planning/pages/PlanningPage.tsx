import { useState } from 'react';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
  type Announcements,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useTitrePage } from '@/shared/hooks/useTitrePage';
import { Button } from '@/shared/ui/Button';
import { Chargement } from '@/shared/ui/Chargement';
import { ErreurChargement } from '@/shared/ui/ErreurChargement';
import { Message } from '@/shared/ui/Message';
import {
  useDeplacerRepas,
  usePlacerRecette,
  useRecettesPlanifiables,
  useRetirerRepas,
  useSemaine,
} from '../api';
import { allerALaCaseVoisine } from '../clavier';
import { Aimant } from '../components/Aimant';
import { BacRecettes } from '../components/BacRecettes';
import { CaseRepas } from '../components/CaseRepas';
import { ChoixRecette } from '../components/ChoixRecette';
import { libelleCase, libelleJour, libelleSemaine } from '../libelles';
import {
  ajouterJours,
  joursDeLaSemaine,
  lireCleCase,
  lundiDe,
  lundiDepuisUrl,
  repasDansCase,
  versIso,
} from '../semaine';
import { CRENEAUX, type Case, type Glisse, type RecettePlanifiable } from '../types';

// Souris : pointeur dans la case. Clavier (pas de pointeur) : case la plus proche.
const detecterCase: CollisionDetection = (args) =>
  args.pointerCoordinates ? pointerWithin(args) : closestCenter(args);

function donnees(evenement: { active: { data: { current?: unknown } } }): Glisse | undefined {
  return evenement.active.data.current as Glisse | undefined;
}

export default function PlanningPage() {
  const { t, i18n } = useTranslation('planning');
  useTitrePage(t('page.titre'));
  const langue = i18n.resolvedLanguage ?? 'fr';

  const [params, setParams] = useSearchParams();
  const lundi = lundiDepuisUrl(params.get('semaine'));
  const lundiIso = versIso(lundi);
  const jours = joursDeLaSemaine(lundi);
  const aujourdhui = versIso(new Date());
  const estSemaineCourante = lundiIso === versIso(lundiDe(new Date()));

  const semaine = useSemaine(lundiIso);
  const recettes = useRecettesPlanifiables();
  const placer = usePlacerRecette(lundiIso);
  const deplacer = useDeplacerRepas(lundiIso);
  const retirer = useRetirerRepas(lundiIso);

  const [enMain, setEnMain] = useState<Glisse | null>(null);
  const [caseAChoisir, setCaseAChoisir] = useState<Case | null>(null);

  const capteurs = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: allerALaCaseVoisine }),
  );

  const changerSemaine = (decalage: number | null) => {
    const suivant = new URLSearchParams(params);
    if (decalage === null) suivant.delete('semaine');
    else suivant.set('semaine', versIso(ajouterJours(lundi, decalage * 7)));
    setParams(suivant, { replace: true });
  };

  const repas = semaine.data ?? [];
  const nomCase = (laCase: Case) => libelleCase(t, laCase, langue);
  const nomCible = (id: string | number | undefined) => {
    const laCase = typeof id === 'string' ? lireCleCase(id) : null;
    return laCase ? nomCase(laCase) : '';
  };

  const poser = (glisse: Glisse, cible: Case) => {
    if (glisse.type === 'recette') {
      placer.mutate({ cible, recette: glisse.recette });
      return;
    }
    const { repas: deplace } = glisse;
    if (deplace.plan_date === cible.date && deplace.slot === cible.creneau) return;
    deplacer.mutate({ repas: deplace, cible, occupant: repasDansCase(repas, cible) });
  };

  const surDebut = ({ active }: DragStartEvent) => setEnMain(donnees({ active }) ?? null);

  const surFin = (evenement: DragEndEvent) => {
    setEnMain(null);
    const glisse = donnees(evenement);
    const cible = evenement.over ? lireCleCase(String(evenement.over.id)) : null;
    if (glisse && cible) poser(glisse, cible);
  };

  const annonces: Announcements = {
    onDragStart: (e) => t('glisser.attrape', { titre: donnees(e)?.titre }),
    onDragOver: (e) =>
      e.over
        ? t('glisser.survol', { titre: donnees(e)?.titre, case: nomCible(e.over.id) })
        : t('glisser.horsCase', { titre: donnees(e)?.titre }),
    onDragEnd: (e) =>
      e.over
        ? t('glisser.pose', { titre: donnees(e)?.titre, case: nomCible(e.over.id) })
        : t('glisser.annule', { titre: donnees(e)?.titre }),
    onDragCancel: (e) => t('glisser.annule', { titre: donnees(e)?.titre }),
  };

  const choisir = (recette: RecettePlanifiable) => {
    if (caseAChoisir) placer.mutate({ cible: caseAChoisir, recette });
    setCaseAChoisir(null);
  };

  const enErreur = placer.isError || deplacer.isError || retirer.isError;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="text-4xl">{t('page.titre')}</h1>
          <p className="mt-2 max-w-lecture text-encre-douce dark:text-seyes">{t('page.intro')}</p>
        </div>
        <nav
          aria-label={t('page.navigation')}
          className="flex flex-wrap items-center gap-2 sm:flex-nowrap"
        >
          <Button
            variante="icone"
            onClick={() => changerSemaine(-1)}
            aria-label={t('page.precedente')}
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </Button>
          <p
            aria-live="polite"
            className="min-w-0 flex-1 text-center font-titre text-lg text-faience dark:text-beurre sm:min-w-56 sm:flex-none sm:text-xl"
          >
            {libelleSemaine(lundi, ajouterJours(lundi, 6), langue)}
          </p>
          <Button
            variante="icone"
            onClick={() => changerSemaine(1)}
            aria-label={t('page.suivante')}
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </Button>
          {!estSemaineCourante && (
            <Button variante="secondaire" onClick={() => changerSemaine(null)}>
              {t('page.cetteSemaine')}
            </Button>
          )}
        </nav>
      </header>

      {enErreur && <Message ton="erreur">{t('erreurs.serveur')}</Message>}

      {!semaine.data ? (
        semaine.isError ? (
          <ErreurChargement onReessayer={() => void semaine.refetch()} />
        ) : (
          <Chargement />
        )
      ) : (
        <DndContext
          sensors={capteurs}
          collisionDetection={detecterCase}
          onDragStart={surDebut}
          onDragEnd={surFin}
          onDragCancel={() => setEnMain(null)}
          accessibility={{
            announcements: annonces,
            screenReaderInstructions: { draggable: t('glisser.instructions') },
          }}
        >
          <ol aria-label={t('page.grille')} className="grid gap-3 md:grid-cols-7 md:gap-2">
            {jours.map((jour) => {
              const date = versIso(jour);
              const estAujourdhui = date === aujourdhui;
              return (
                <li
                  key={date}
                  className={cn(
                    'flex flex-col gap-2 rounded-fiche bg-papier-fonce p-2 dark:bg-nuit-carte',
                    estAujourdhui && 'ring-2 ring-beurre',
                  )}
                >
                  <h2 className="flex flex-wrap items-baseline justify-between gap-x-2 px-1 md:flex-col md:items-start">
                    <span className="font-titre text-lg capitalize">
                      {libelleJour(jour, langue).jour}
                    </span>
                    <span className="text-sm text-encre-douce dark:text-seyes">
                      {estAujourdhui ? (
                        <strong className="font-main text-base font-normal text-vichy-fonce dark:text-beurre">
                          {t('case.aujourdhui')}
                        </strong>
                      ) : (
                        libelleJour(jour, langue).date
                      )}
                    </span>
                  </h2>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
                    {CRENEAUX.map((creneau) => {
                      const laCase = { date, creneau };
                      return (
                        <CaseRepas
                          key={creneau}
                          laCase={laCase}
                          libelle={nomCase(laCase)}
                          repas={repasDansCase(repas, laCase)}
                          onChoisir={() => setCaseAChoisir(laCase)}
                          onRetirer={(r) => retirer.mutate(r)}
                        />
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ol>

          {recettes.data ? (
            <BacRecettes recettes={recettes.data} />
          ) : recettes.isError ? (
            <ErreurChargement onReessayer={() => void recettes.refetch()} />
          ) : null}

          <DragOverlay dropAnimation={null}>
            {enMain && (
              <Aimant
                recetteId={enMain.type === 'repas' ? enMain.repas.recipe_id : enMain.recette.id}
                titre={enMain.titre}
                enMain
              />
            )}
          </DragOverlay>
        </DndContext>
      )}

      {caseAChoisir && (
        <ChoixRecette
          libelleCase={nomCase(caseAChoisir)}
          recettes={recettes.data ?? []}
          onChoisir={choisir}
          onFermer={() => setCaseAChoisir(null)}
        />
      )}
    </div>
  );
}
