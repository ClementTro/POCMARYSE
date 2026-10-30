import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { MiseAJour } from '@/core/database.types';
import { useTheme } from '@/shared/theme/useTheme';
import { useModifierProfil, useProfil } from './api';

/**
 * Relie la langue et le thème au profil Supabase :
 * - à l'ouverture de l'app, les préférences du compte l'emportent (on les retrouve sur un autre appareil) ;
 * - ensuite, chaque changement (en-tête ou page Profil) est enregistré dans le profil.
 * On compare aux valeurs précédentes, pas au profil : l'application du profil ne doit pas être réenregistrée
 * pendant que `changeLanguage` est encore en cours.
 */
export function SynchroPreferences() {
  const { data: profil } = useProfil();
  const { mutate: modifier } = useModifierProfil();
  const { preference, setPreference } = useTheme();
  const { i18n } = useTranslation();
  const langue = i18n.resolvedLanguage === 'en' ? 'en' : 'fr';

  const profilApplique = useRef<string | null>(null);
  const precedent = useRef({ preference, langue });

  useEffect(() => {
    const avant = precedent.current;
    precedent.current = { preference, langue };
    if (!profil) return;

    if (profilApplique.current !== profil.id) {
      profilApplique.current = profil.id;
      if (profil.theme !== preference) setPreference(profil.theme);
      if (profil.locale !== langue) void i18n.changeLanguage(profil.locale);
      return;
    }

    const modification: MiseAJour<'profiles'> = {};
    if (preference !== avant.preference && preference !== profil.theme) {
      modification.theme = preference;
    }
    if (langue !== avant.langue && langue !== profil.locale) modification.locale = langue;
    if (Object.keys(modification).length) modifier(modification);
  }, [profil, preference, langue, setPreference, i18n, modifier]);

  return null;
}
