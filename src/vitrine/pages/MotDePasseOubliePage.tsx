import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { clientSupabase, urlApplication } from '@/core/supabase';
import { useTitrePage } from '@/shared/hooks/useTitrePage';
import { Button } from '@/shared/ui/Button';
import { ChampTexte } from '@/shared/ui/Champ';
import { Message } from '@/shared/ui/Message';
import { CadreAuth } from '@/vitrine/auth/CadreAuth';
import { cleErreurAuth } from '@/vitrine/auth/erreursAuth';
import { schemaOubli, type ValeursOubli } from '@/vitrine/auth/schemas';

const LIEN = 'font-semibold text-faience underline underline-offset-4 dark:text-beurre';

export default function MotDePasseOubliePage() {
  const { t } = useTranslation('auth');
  useTitrePage(t('oubli.titre'));
  const [erreurServeur, setErreurServeur] = useState<string | null>(null);
  const [emailEnvoye, setEmailEnvoye] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ValeursOubli>({ resolver: zodResolver(schemaOubli) });

  const surEnvoi = async ({ email }: ValeursOubli) => {
    setErreurServeur(null);
    const { error } = await clientSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: urlApplication('nouveau-mot-de-passe'),
    });
    if (error && error.code !== 'user_not_found') {
      setErreurServeur(cleErreurAuth(error));
      return;
    }
    setEmailEnvoye(email);
  };

  const pied = (
    <Link to="/connexion" className={LIEN}>
      {t('oubli.retour')}
    </Link>
  );

  if (emailEnvoye) {
    return (
      <CadreAuth titre={t('oubli.envoyeTitre')} pied={pied}>
        <Message ton="succes">{t('oubli.envoyeTexte', { email: emailEnvoye })}</Message>
      </CadreAuth>
    );
  }

  return (
    <CadreAuth titre={t('oubli.titre')} pied={pied}>
      <form noValidate onSubmit={handleSubmit(surEnvoi)} className="flex flex-col gap-4">
        <p>{t('oubli.texte')}</p>
        {erreurServeur && <Message ton="erreur">{t(erreurServeur)}</Message>}
        <ChampTexte
          label={t('champs.email')}
          type="email"
          autoComplete="email"
          erreur={errors.email?.message ? t(errors.email.message) : undefined}
          {...register('email')}
        />
        <Button type="submit" disabled={isSubmitting}>
          {t('oubli.bouton')}
        </Button>
      </form>
    </CadreAuth>
  );
}
