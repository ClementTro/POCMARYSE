import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays } from 'lucide-react';
import { ajouterJours, formaterPeriode, lundiDe, versIso } from '@/shared/lib/dates';
import { Button, LienBouton } from '@/shared/ui/Button';
import { ChampListe } from '@/shared/ui/Champ';
import { Fiche } from '@/shared/ui/Fiche';
import { Message } from '@/shared/ui/Message';
import { useGenererDepuisPlanning } from '../api';

export function GenerateurPlanning({ dejaGeneree }: { dejaGeneree: boolean }) {
  const { t, i18n } = useTranslation('courses');
  const langue = i18n.resolvedLanguage ?? 'fr';
  const generer = useGenererDepuisPlanning();

  const lundi = lundiDe(new Date());
  const semaines = [
    { cle: 'cetteSemaine', debut: lundi },
    { cle: 'semaineProchaine', debut: ajouterJours(lundi, 7) },
  ].map(({ cle, debut }) => ({
    valeur: versIso(debut),
    libelle: t(`generation.${cle}`, {
      periode: formaterPeriode(debut, ajouterJours(debut, 6), langue, 'short'),
    }),
  }));
  const [semaine, setSemaine] = useState(versIso(lundi));

  return (
    <Fiche
      as="section"
      aria-labelledby="titre-generation"
      className="no-print flex flex-col gap-4 p-5"
    >
      <h2 id="titre-generation" className="flex items-center gap-2 text-2xl">
        <CalendarDays aria-hidden="true" className="h-6 w-6 text-vichy" />
        {t('generation.titre')}
      </h2>
      <p className="text-encre-douce dark:text-seyes">{t('generation.texte')}</p>
      <ChampListe
        label={t('generation.semaine')}
        value={semaine}
        onChange={(evenement) => {
          setSemaine(evenement.target.value);
          generer.reset();
        }}
      >
        {semaines.map(({ valeur, libelle }) => (
          <option key={valeur} value={valeur}>
            {libelle}
          </option>
        ))}
      </ChampListe>
      {dejaGeneree && <p className="text-sm">{t('generation.remplace')}</p>}
      <Button
        onClick={() => generer.mutate(semaine)}
        disabled={generer.isPending}
        className="self-start"
      >
        {t('generation.bouton')}
      </Button>

      {generer.isError && <Message ton="erreur">{t('erreurs.serveur')}</Message>}
      {generer.data &&
        (generer.data.repas ? (
          <Message ton="succes">
            {t('generation.resultat', { count: generer.data.articles, repas: generer.data.repas })}
          </Message>
        ) : (
          <div className="flex flex-col items-start gap-2">
            <Message ton="info" className="self-stretch">
              {t('generation.aucunRepas')}
            </Message>
            <LienBouton to={`/app/planning?semaine=${semaine}`} variante="discret">
              {t('generation.ouvrirPlanning')}
            </LienBouton>
          </div>
        ))}
    </Fiche>
  );
}
