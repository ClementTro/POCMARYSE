import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { clientSupabase, urlApplication } from '@/core/supabase';
import { useTitrePage } from '@/shared/hooks/useTitrePage';
import { Button } from '@/shared/ui/Button';
import { ChampTexte } from '@/shared/ui/Champ';
import { Message } from '@/shared/ui/Message';
import { CadreAuth } from '@/vitrine/auth/CadreAuth';
import { cleErreurAuth } from '@/vitrine/auth/erreursAuth';
import { schemaInscription, type ValeursInscription } from '@/vitrine/auth/schemas';

const LIEN = 'font-semibold text-faience underline underline-offset-4 dark:text-beurre';

export default function InscriptionPage() {
  const { t, i18n } = useTranslation('auth');
  useTitrePage(t('inscription.titre'));
  const navigate = useNavigate();
  const [erreurServeur, setErreurServeur] = useState<string | null>(null);
  const [emailEnvoye, setEmailEnvoye] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ValeursInscription>({ resolver: zodResolver(schemaInscription) });

  const surEnvoi = async ({ nom, email, motDePasse }: ValeursInscription) => {
    setErreurServeur(null);
    const { data, error } = await clientSupabase().auth.signUp({
      email,
      password: motDePasse,
      options: {
        data: { display_name: nom, locale: i18n.resolvedLanguage === 'en' ? 'en' : 'fr' },
        emailRedirectTo: urlApplication('app'),
      },
    });
    if (error) {
      setErreurServeur(cleErreurAuth(error));
      return;
    }
    if (data.session) {
      navigate('/app', { replace: true });
      return;
    }
    setEmailEnvoye(email);
  };

  const erreur = (cle?: string) => (cle ? t(cle) : undefined);

  if (emailEnvoye) {
    return (
      <CadreAuth titre={t('inscription.verifieTitre')}>
        <Message ton="succes">{t('inscription.verifieTexte', { email: emailEnvoye })}</Message>
      </CadreAuth>
    );
  }

  return (
    <CadreAuth
      titre={t('inscription.titre')}
      note={t('inscription.note')}
      pied={
        <p>
          {t('inscription.dejaCompte')}{' '}
          <Link to="/connexion" className={LIEN}>
            {t('inscription.seConnecter')}
          </Link>
        </p>
      }
    >
      <form noValidate onSubmit={handleSubmit(surEnvoi)} className="flex flex-col gap-4">
        {erreurServeur && <Message ton="erreur">{t(erreurServeur)}</Message>}
        <ChampTexte
          label={t('champs.nom')}
          aide={t('champs.nomAide')}
          autoComplete="given-name"
          erreur={erreur(errors.nom?.message)}
          {...register('nom')}
        />
        <ChampTexte
          label={t('champs.email')}
          type="email"
          autoComplete="email"
          erreur={erreur(errors.email?.message)}
          {...register('email')}
        />
        <ChampTexte
          label={t('champs.motDePasse')}
          aide={t('champs.motDePasseAide')}
          type="password"
          autoComplete="new-password"
          erreur={erreur(errors.motDePasse?.message)}
          {...register('motDePasse')}
        />
        <ChampTexte
          label={t('champs.confirmation')}
          type="password"
          autoComplete="new-password"
          erreur={erreur(errors.confirmation?.message)}
          {...register('confirmation')}
        />
        <p className="text-sm text-encre-douce dark:text-seyes">
          <Trans
            t={t}
            i18nKey="inscription.consentement"
            components={{ 1: <Link to="/confidentialite" className={LIEN} /> }}
          />
        </p>
        <Button type="submit" disabled={isSubmitting}>
          {t('inscription.bouton')}
        </Button>
      </form>
    </CadreAuth>
  );
}
