import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useAuth } from '@/core/auth/useAuth';
import { useModifierProfil, useProfil } from '@/core/profil/api';
import { useTitrePage } from '@/shared/hooks/useTitrePage';
import { cn } from '@/shared/lib/cn';
import { useTheme } from '@/shared/theme/useTheme';
import type { PreferenceTheme } from '@/shared/theme/themeContext';
import { Button, LienBouton } from '@/shared/ui/Button';
import { Chargement } from '@/shared/ui/Chargement';
import { ChampTexte } from '@/shared/ui/Champ';
import { ErreurChargement } from '@/shared/ui/ErreurChargement';
import { Fiche } from '@/shared/ui/Fiche';
import { Message } from '@/shared/ui/Message';

const LONGUEUR_MAX_NOM = 60;

const schemaNom = z.object({
  nom: z.string().trim().max(LONGUEUR_MAX_NOM, 'profil.nom.tropLong'),
});
type ValeursNom = z.infer<typeof schemaNom>;

interface Option<V extends string> {
  valeur: V;
  libelle: string;
  lang?: string;
}

/** Boutons radio présentés comme des pastilles : un seul choix, appliqué immédiatement. */
function GroupeChoix<V extends string>({
  legende,
  nom,
  options,
  valeur,
  onChoisir,
}: {
  legende: string;
  nom: string;
  options: Option<V>[];
  valeur: V;
  onChoisir: (valeur: V) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 font-semibold">{legende}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.valeur}
            lang={option.lang}
            className={cn(
              'flex min-h-11 cursor-pointer items-center rounded-bouton border-2 px-4 font-semibold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-faience has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-beurre',
              option.valeur === valeur
                ? 'border-faience bg-faience text-papier dark:border-beurre dark:bg-beurre dark:text-nuit'
                : 'border-seyes text-encre hover:border-faience dark:border-nuit-ligne dark:text-papier dark:hover:border-seyes',
            )}
          >
            <input
              type="radio"
              name={nom}
              value={option.valeur}
              checked={option.valeur === valeur}
              onChange={() => onChoisir(option.valeur)}
              className="sr-only"
            />
            {option.libelle}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function FormulaireNom({ nomActuel }: { nomActuel: string }) {
  const { t } = useTranslation('app');
  const modifier = useModifierProfil();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ValeursNom>({
    resolver: zodResolver(schemaNom),
    defaultValues: { nom: nomActuel },
  });

  useEffect(() => reset({ nom: nomActuel }), [nomActuel, reset]);

  const surEnvoi = ({ nom }: ValeursNom) => modifier.mutate({ display_name: nom });

  return (
    <form noValidate onSubmit={handleSubmit(surEnvoi)} className="flex flex-col gap-4">
      <ChampTexte
        label={t('profil.nom.libelle')}
        aide={t('profil.nom.aide')}
        autoComplete="given-name"
        maxLength={LONGUEUR_MAX_NOM + 10}
        erreur={errors.nom?.message ? t(errors.nom.message) : undefined}
        {...register('nom')}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={modifier.isPending || !isDirty}>
          {t('profil.nom.enregistrer')}
        </Button>
        {modifier.isSuccess && !isDirty && (
          <p role="status" className="font-main text-lg text-sauge-fonce dark:text-sauge">
            {t('profil.nom.enregistre')}
          </p>
        )}
      </div>
      {modifier.isError && <Message ton="erreur">{t('profil.erreurServeur')}</Message>}
    </form>
  );
}

export function ProfilPage() {
  const { t, i18n } = useTranslation('app');
  useTitrePage(t('common:nav.profil'));
  const { utilisateur } = useAuth();
  const profil = useProfil();
  const { preference, setPreference } = useTheme();
  const langue = i18n.resolvedLanguage === 'en' ? 'en' : 'fr';

  const themes: Option<PreferenceTheme>[] = [
    { valeur: 'clair', libelle: t('profil.preferences.clair') },
    { valeur: 'sombre', libelle: t('profil.preferences.sombre') },
    { valeur: 'systeme', libelle: t('profil.preferences.systeme') },
  ];
  const langues: Option<'fr' | 'en'>[] = [
    { valeur: 'fr', libelle: t('common:langue.fr'), lang: 'fr' },
    { valeur: 'en', libelle: t('common:langue.en'), lang: 'en' },
  ];

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <header>
        <h1 className="text-4xl">{t('common:nav.profil')}</h1>
        <p className="mt-2 max-w-lecture text-encre-douce dark:text-seyes">{t('profil.intro')}</p>
      </header>

      <Fiche as="section" aria-labelledby="titre-nom" className="flex flex-col gap-4 p-6">
        <h2 id="titre-nom" className="text-2xl">
          {t('profil.nom.titre')}
        </h2>
        {profil.data !== undefined ? (
          <FormulaireNom nomActuel={profil.data?.display_name ?? ''} />
        ) : profil.isError ? (
          <ErreurChargement onReessayer={() => void profil.refetch()} />
        ) : (
          <Chargement />
        )}
      </Fiche>

      <Fiche as="section" aria-labelledby="titre-preferences" className="flex flex-col gap-6 p-6">
        <div>
          <h2 id="titre-preferences" className="text-2xl">
            {t('profil.preferences.titre')}
          </h2>
          <p className="mt-1 text-encre-douce dark:text-seyes">{t('profil.preferences.aide')}</p>
        </div>
        <GroupeChoix
          legende={t('common:langue.choisir')}
          nom="langue"
          options={langues}
          valeur={langue}
          onChoisir={(choix) => void i18n.changeLanguage(choix)}
        />
        <GroupeChoix
          legende={t('profil.preferences.theme')}
          nom="theme"
          options={themes}
          valeur={preference}
          onChoisir={setPreference}
        />
      </Fiche>

      <Fiche as="section" aria-labelledby="titre-compte" className="flex flex-col gap-4 p-6">
        <h2 id="titre-compte" className="text-2xl">
          {t('profil.compte.titre')}
        </h2>
        <dl>
          <dt className="text-sm text-encre-douce dark:text-seyes">{t('profil.compte.email')}</dt>
          <dd className="break-all font-semibold">{utilisateur?.email}</dd>
        </dl>
        <div>
          <LienBouton to="/mot-de-passe-oublie" variante="secondaire">
            {t('profil.compte.motDePasse')}
          </LienBouton>
        </div>
      </Fiche>
    </div>
  );
}
