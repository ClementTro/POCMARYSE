import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/useAuth';
import { clientSupabase } from '@/core/supabase';
import { useTitrePage } from '@/shared/hooks/useTitrePage';
import { Button, LienBouton } from '@/shared/ui/Button';
import { ChampTexte } from '@/shared/ui/Champ';
import { Chargement } from '@/shared/ui/Chargement';
import { Message } from '@/shared/ui/Message';
import { CadreAuth } from '@/vitrine/auth/CadreAuth';
import { cleErreurAuth } from '@/vitrine/auth/erreursAuth';
import { schemaNouveauMotDePasse, type ValeursNouveauMotDePasse } from '@/vitrine/auth/schemas';

/** Page atteinte par le lien de réinitialisation : Supabase y ouvre une session de récupération. */
export default function NouveauMotDePassePage() {
  const { t } = useTranslation('auth');
  useTitrePage(t('nouveau.titre'));
  const navigate = useNavigate();
  const { session, chargement, configure } = useAuth();
  const [erreurServeur, setErreurServeur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ValeursNouveauMotDePasse>({ resolver: zodResolver(schemaNouveauMotDePasse) });

  const surEnvoi = async ({ motDePasse }: ValeursNouveauMotDePasse) => {
    setErreurServeur(null);
    const { error } = await clientSupabase().auth.updateUser({ password: motDePasse });
    if (error) {
      setErreurServeur(cleErreurAuth(error));
      return;
    }
    setSucces(true);
    window.setTimeout(() => navigate('/app', { replace: true }), 1500);
  };

  if (configure && chargement) return <Chargement />;

  if (configure && !session) {
    return (
      <CadreAuth titre={t('nouveau.lienInvalideTitre')}>
        <p>{t('nouveau.lienInvalideTexte')}</p>
        <LienBouton to="/mot-de-passe-oublie">{t('nouveau.redemander')}</LienBouton>
      </CadreAuth>
    );
  }

  return (
    <CadreAuth titre={t('nouveau.titre')}>
      {succes ? (
        <Message ton="succes">{t('nouveau.succes')}</Message>
      ) : (
        <form noValidate onSubmit={handleSubmit(surEnvoi)} className="flex flex-col gap-4">
          {erreurServeur && <Message ton="erreur">{t(erreurServeur)}</Message>}
          <ChampTexte
            label={t('champs.nouveauMotDePasse')}
            aide={t('champs.motDePasseAide')}
            type="password"
            autoComplete="new-password"
            erreur={errors.motDePasse?.message ? t(errors.motDePasse.message) : undefined}
            {...register('motDePasse')}
          />
          <ChampTexte
            label={t('champs.confirmation')}
            type="password"
            autoComplete="new-password"
            erreur={errors.confirmation?.message ? t(errors.confirmation.message) : undefined}
            {...register('confirmation')}
          />
          <Button type="submit" disabled={isSubmitting}>
            {t('nouveau.bouton')}
          </Button>
        </form>
      )}
    </CadreAuth>
  );
}
