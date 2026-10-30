import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTitrePage } from '@/shared/hooks/useTitrePage';
import { LienBouton } from '@/shared/ui/Button';
import { Chargement } from '@/shared/ui/Chargement';
import { ErreurChargement } from '@/shared/ui/ErreurChargement';
import { EtatVide } from '@/shared/ui/EtatVide';
import { useEnregistrerRecette, useRecette } from '../api';
import { FormulaireRecette } from '../components/FormulaireRecette';
import {
  VALEURS_NOUVELLE_RECETTE,
  versValeursFormulaire,
  type ValeursRecette,
} from '../formulaire';
import { estDemo } from '../recettes';
import type { EtatNavigationRecette } from '../types';

/** Création (`/nouvelle`) ou modification (`/:id/modifier`) d'une recette. */
export default function EditionRecettePage() {
  const { t, i18n } = useTranslation('recettes');
  const { id } = useParams();
  const navigate = useNavigate();
  const recette = useRecette(id);
  const enregistrer = useEnregistrerRecette();
  const titre = id ? t('formulaire.titreModifier') : t('formulaire.titreNouvelle');
  useTitrePage(titre);

  const surEnregistrement = async (valeurs: ValeursRecette) => {
    const enregistree = await enregistrer.mutateAsync({ id, valeurs }).catch(() => null);
    if (!enregistree) return;
    navigate(`../${enregistree.id}`, {
      replace: Boolean(id),
      state: { message: 'formulaire.enregistre' } satisfies EtatNavigationRecette,
    });
  };

  let valeursInitiales = VALEURS_NOUVELLE_RECETTE;
  if (id) {
    if (recette.isPending) return <Chargement />;
    if (recette.isError) return <ErreurChargement onReessayer={() => void recette.refetch()} />;
    if (!recette.data) {
      return (
        <EtatVide
          titre={t('fiche.introuvableTitre')}
          texte={t('fiche.introuvableTexte')}
          action={<LienBouton to="..">{t('fiche.retour')}</LienBouton>}
        />
      );
    }
    if (estDemo(recette.data)) return <Navigate to={`../${id}`} replace />;
    valeursInitiales = versValeursFormulaire(recette.data, i18n.resolvedLanguage ?? 'fr');
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl">{titre}</h1>
      <FormulaireRecette
        key={id ?? 'nouvelle'}
        valeursInitiales={valeursInitiales}
        onEnregistrer={surEnregistrement}
        onAnnuler={() => navigate(id ? `../${id}` : '..')}
        erreurServeur={enregistrer.isError}
      />
    </div>
  );
}
