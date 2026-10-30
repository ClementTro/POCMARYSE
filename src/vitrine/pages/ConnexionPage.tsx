import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clientSupabase } from '@/core/supabase';
import { useTitrePage } from '@/shared/hooks/useTitrePage';
import { Button } from '@/shared/ui/Button';
import { ChampTexte } from '@/shared/ui/Champ';
import { Message } from '@/shared/ui/Message';
import { CadreAuth } from '@/vitrine/auth/CadreAuth';
import { cleErreurAuth } from '@/vitrine/auth/erreursAuth';
import { schemaConnexion, type ValeursConnexion } from '@/vitrine/auth/schemas';

const LIEN = 'font-semibold text-faience underline underline-offset-4 dark:text-beurre';

export default function ConnexionPage() {
  const { t } = useTranslation('auth');
  useTitrePage(t('connexion.titre'));
  const navigate = useNavigate();
  const location = useLocation();
  const depuis = (location.state as { depuis?: string } | null)?.depuis ?? '/app';
  const [erreurServeur, setErreurServeur] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ValeursConnexion>({ resolver: zodResolver(schemaConnexion) });

  const surEnvoi = async ({ email, motDePasse }: ValeursConnexion) => {
    setErreurServeur(null);
    const { error } = await clientSupabase().auth.signInWithPassword({
      email,
      password: motDePasse,
    });
    if (error) {
      setErreurServeur(cleErreurAuth(error));
      return;
    }
    navigate(depuis, { replace: true });
  };

  const erreur = (cle?: string) => (cle ? t(cle) : undefined);

  return (
    <CadreAuth
      titre={t('connexion.titre')}
      note={t('connexion.note')}
      pied={
        <p>
          {t('connexion.pasDeCompte')}{' '}
          <Link to="/inscription" className={LIEN}>
            {t('connexion.creer')}
          </Link>
        </p>
      }
    >
      <form noValidate onSubmit={handleSubmit(surEnvoi)} className="flex flex-col gap-4">
        {erreurServeur && <Message ton="erreur">{t(erreurServeur)}</Message>}
        <ChampTexte
          label={t('champs.email')}
          type="email"
          autoComplete="email"
          erreur={erreur(errors.email?.message)}
          {...register('email')}
        />
        <ChampTexte
          label={t('champs.motDePasse')}
          type="password"
          autoComplete="current-password"
          erreur={erreur(errors.motDePasse?.message)}
          {...register('motDePasse')}
        />
        <Link to="/mot-de-passe-oublie" className={`${LIEN} self-start text-sm`}>
          {t('connexion.oubli')}
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {t('connexion.bouton')}
        </Button>
      </form>
    </CadreAuth>
  );
}
