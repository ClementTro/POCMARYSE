import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { ChampListe, ChampTexte, ChampZone } from '@/shared/ui/Champ';
import { Fiche } from '@/shared/ui/Fiche';
import { Message } from '@/shared/ui/Message';
import { ETAPE_VIDE, INGREDIENT_VIDE, schemaRecette, type ValeursRecette } from '../formulaire';
import { DIFFICULTES } from '../types';

interface FormulaireRecetteProps {
  valeursInitiales: ValeursRecette;
  onEnregistrer: (valeurs: ValeursRecette) => Promise<void>;
  onAnnuler: () => void;
  erreurServeur: boolean;
}

function ErreurListe({ message }: { message?: string }) {
  const { t } = useTranslation('recettes');
  if (!message) return null;
  return (
    <p role="alert" className="text-sm font-semibold text-vichy">
      {t(message)}
    </p>
  );
}

export function FormulaireRecette({
  valeursInitiales,
  onEnregistrer,
  onAnnuler,
  erreurServeur,
}: FormulaireRecetteProps) {
  const { t } = useTranslation('recettes');
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ValeursRecette>({
    resolver: zodResolver(schemaRecette),
    defaultValues: valeursInitiales,
  });
  const ingredients = useFieldArray({ control, name: 'ingredients' });
  const etapes = useFieldArray({ control, name: 'etapes' });
  const erreur = (cle?: string) => (cle ? t(cle) : undefined);

  return (
    <form noValidate onSubmit={handleSubmit(onEnregistrer)} className="flex flex-col gap-6">
      {erreurServeur && <Message ton="erreur">{t('erreurs.serveur')}</Message>}

      <Fiche as="section" className="grid gap-4 p-6 sm:grid-cols-2">
        <ChampTexte
          label={t('formulaire.titre')}
          classeCadre="sm:col-span-2"
          erreur={erreur(errors.titre?.message)}
          {...register('titre')}
        />
        <ChampZone
          label={t('formulaire.description')}
          aide={t('formulaire.descriptionAide')}
          classeCadre="sm:col-span-2"
          rows={3}
          erreur={erreur(errors.description?.message)}
          {...register('description')}
        />
        <div className="grid gap-4 sm:col-span-2 sm:grid-cols-4">
          <ChampTexte
            label={t('formulaire.portions')}
            inputMode="numeric"
            erreur={erreur(errors.portions?.message)}
            {...register('portions')}
          />
          <ChampTexte
            label={t('formulaire.preparation')}
            inputMode="numeric"
            erreur={erreur(errors.preparation?.message)}
            {...register('preparation')}
          />
          <ChampTexte
            label={t('formulaire.cuisson')}
            inputMode="numeric"
            erreur={erreur(errors.cuisson?.message)}
            {...register('cuisson')}
          />
          <ChampListe label={t('formulaire.difficulte')} {...register('difficulte')}>
            {DIFFICULTES.map((difficulte) => (
              <option key={difficulte} value={difficulte}>
                {t(`difficultes.${difficulte}`)}
              </option>
            ))}
          </ChampListe>
        </div>
        <ChampTexte
          label={t('formulaire.etiquettes')}
          aide={t('formulaire.etiquettesAide')}
          classeCadre="sm:col-span-2"
          erreur={erreur(errors.etiquettes?.message)}
          {...register('etiquettes')}
        />
      </Fiche>

      <Fiche as="section" aria-labelledby="titre-ingredients" className="flex flex-col gap-4 p-6">
        <div>
          <h2 id="titre-ingredients" className="text-2xl">
            {t('formulaire.ingredients')}
          </h2>
          <p className="text-sm text-encre-douce dark:text-seyes">
            {t('formulaire.ingredientsAide')}
          </p>
        </div>
        <ol className="flex flex-col gap-3">
          {ingredients.fields.map((champ, index) => {
            const n = index + 1;
            const erreurs = errors.ingredients?.[index];
            return (
              <li
                key={champ.id}
                className="grid grid-cols-[1fr_auto] items-start gap-2 sm:grid-cols-[minmax(0,3fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
              >
                <ChampTexte
                  label={t('formulaire.ingredient', { n })}
                  masquerLabel
                  placeholder={t('formulaire.ingredient', { n })}
                  classeCadre="col-span-2 sm:col-span-1"
                  erreur={erreur(erreurs?.nom?.message)}
                  {...register(`ingredients.${index}.nom`)}
                />
                <ChampTexte
                  label={`${t('formulaire.quantite')} (${t('formulaire.ingredient', { n })})`}
                  masquerLabel
                  placeholder={t('formulaire.quantite')}
                  inputMode="decimal"
                  erreur={erreur(erreurs?.quantite?.message)}
                  {...register(`ingredients.${index}.quantite`)}
                />
                <ChampTexte
                  label={`${t('formulaire.unite')} (${t('formulaire.ingredient', { n })})`}
                  masquerLabel
                  placeholder={t('formulaire.unitePlaceholder')}
                  erreur={erreur(erreurs?.unite?.message)}
                  {...register(`ingredients.${index}.unite`)}
                />
                <Button
                  variante="icone"
                  onClick={() => ingredients.remove(index)}
                  disabled={ingredients.fields.length === 1}
                  aria-label={t('formulaire.retirerIngredient', { n })}
                  className="row-start-2 sm:row-start-auto"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </Button>
              </li>
            );
          })}
        </ol>
        <ErreurListe message={errors.ingredients?.root?.message ?? errors.ingredients?.message} />
        <div>
          <Button variante="secondaire" onClick={() => ingredients.append(INGREDIENT_VIDE)}>
            <Plus aria-hidden="true" className="h-5 w-5" />
            {t('formulaire.ajouterIngredient')}
          </Button>
        </div>
      </Fiche>

      <Fiche as="section" aria-labelledby="titre-etapes" className="flex flex-col gap-4 p-6">
        <h2 id="titre-etapes" className="text-2xl">
          {t('formulaire.etapes')}
        </h2>
        <ol className="flex flex-col gap-3">
          {etapes.fields.map((champ, index) => {
            const n = index + 1;
            return (
              <li key={champ.id} className="flex items-start gap-2">
                <ChampZone
                  label={t('formulaire.etape', { n })}
                  classeCadre="flex-1"
                  rows={2}
                  erreur={erreur(errors.etapes?.[index]?.texte?.message)}
                  {...register(`etapes.${index}.texte`)}
                />
                <Button
                  variante="icone"
                  onClick={() => etapes.remove(index)}
                  disabled={etapes.fields.length === 1}
                  aria-label={t('formulaire.retirerEtape', { n })}
                  className="mt-7"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </Button>
              </li>
            );
          })}
        </ol>
        <ErreurListe message={errors.etapes?.root?.message ?? errors.etapes?.message} />
        <div>
          <Button variante="secondaire" onClick={() => etapes.append(ETAPE_VIDE)}>
            <Plus aria-hidden="true" className="h-5 w-5" />
            {t('formulaire.ajouterEtape')}
          </Button>
        </div>
      </Fiche>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {t('formulaire.enregistrer')}
        </Button>
        <Button variante="discret" onClick={onAnnuler}>
          {t('common:actions.annuler')}
        </Button>
      </div>
    </form>
  );
}
