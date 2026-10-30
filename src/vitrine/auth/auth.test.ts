import { cleErreurAuth } from './erreursAuth';
import { schemaInscription } from './schemas';

describe('schemaInscription', () => {
  const valides = {
    nom: 'Maryse',
    email: 'maryse@example.com',
    motDePasse: 'carnet2026',
    confirmation: 'carnet2026',
  };

  it('accepte une inscription complète', () => {
    expect(schemaInscription.safeParse(valides).success).toBe(true);
  });

  it('refuse deux mots de passe différents, sur le champ de confirmation', () => {
    const resultat = schemaInscription.safeParse({ ...valides, confirmation: 'autre-chose' });
    expect(resultat.success).toBe(false);
    expect(resultat.error?.issues[0]?.path).toEqual(['confirmation']);
    expect(resultat.error?.issues[0]?.message).toBe('erreurs.confirmation');
  });

  it('refuse un mot de passe trop court', () => {
    const resultat = schemaInscription.safeParse({
      ...valides,
      motDePasse: 'court',
      confirmation: 'court',
    });
    expect(resultat.error?.issues[0]?.message).toBe('erreurs.motDePasseCourt');
  });
});

describe('cleErreurAuth', () => {
  it('traduit les codes Supabase connus', () => {
    expect(cleErreurAuth({ code: 'invalid_credentials' })).toBe('erreurs.identifiants');
    expect(cleErreurAuth({ code: 'email_not_confirmed' })).toBe('erreurs.nonConfirme');
  });

  it('retombe sur une erreur générique', () => {
    expect(cleErreurAuth({ code: 'code_inconnu' })).toBe('erreurs.inconnue');
    expect(cleErreurAuth(null)).toBe('erreurs.inconnue');
  });
});
