import { z } from 'zod';

// Les messages sont des clés de traduction du namespace `auth`.
const email = z.email('erreurs.email');
const motDePasseNeuf = z.string().min(8, 'erreurs.motDePasseCourt');

export const schemaConnexion = z.object({
  email,
  motDePasse: z.string().min(1, 'erreurs.motDePasseRequis'),
});

export const schemaInscription = z
  .object({
    nom: z.string().trim().min(1, 'erreurs.nomRequis').max(60, 'erreurs.nomTropLong'),
    email,
    motDePasse: motDePasseNeuf,
    confirmation: z.string(),
  })
  .refine((valeurs) => valeurs.motDePasse === valeurs.confirmation, {
    message: 'erreurs.confirmation',
    path: ['confirmation'],
  });

export const schemaOubli = z.object({ email });

export const schemaNouveauMotDePasse = z
  .object({ motDePasse: motDePasseNeuf, confirmation: z.string() })
  .refine((valeurs) => valeurs.motDePasse === valeurs.confirmation, {
    message: 'erreurs.confirmation',
    path: ['confirmation'],
  });

export type ValeursConnexion = z.infer<typeof schemaConnexion>;
export type ValeursInscription = z.infer<typeof schemaInscription>;
export type ValeursOubli = z.infer<typeof schemaOubli>;
export type ValeursNouveauMotDePasse = z.infer<typeof schemaNouveauMotDePasse>;
