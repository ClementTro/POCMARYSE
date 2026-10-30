import { useTranslation } from 'react-i18next';
import { LangSwitch } from '@/shared/ui/LangSwitch';
import { NoteManuscrite } from '@/shared/ui/NoteManuscrite';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';

export function App() {
  const { t } = useTranslation();
  return (
    <main className="papier-seyes flex min-h-screen flex-col items-start justify-center gap-4 px-6 sm:px-16">
      <div className="flex gap-2">
        <LangSwitch />
        <ThemeToggle />
      </div>
      <h1 className="text-5xl">{t('marque')}</h1>
      <NoteManuscrite>{t('etat.chargement')}</NoteManuscrite>
    </main>
  );
}
