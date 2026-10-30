import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VALEURS_NOUVELLE_RECETTE } from '../formulaire';
import { FormulaireRecette } from './FormulaireRecette';

function rendre() {
  const onEnregistrer = vi.fn().mockResolvedValue(undefined);
  render(
    <FormulaireRecette
      valeursInitiales={VALEURS_NOUVELLE_RECETTE}
      onEnregistrer={onEnregistrer}
      onAnnuler={vi.fn()}
      erreurServeur={false}
    />,
  );
  return { onEnregistrer };
}

describe('FormulaireRecette', () => {
  it('affiche les erreurs traduites et n’enregistre pas un formulaire vide', async () => {
    const { onEnregistrer } = rendre();
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer la recette' }));
    expect(await screen.findByText('Donne un nom à la recette.')).toBeInTheDocument();
    expect(screen.getByText('Ajoute au moins un ingrédient.')).toBeInTheDocument();
    expect(screen.getByText('Ajoute au moins une étape.')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Nom de la recette' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(onEnregistrer).not.toHaveBeenCalled();
  });

  it('enregistre une recette complète, ingrédients ajoutés et retirés', async () => {
    const { onEnregistrer } = rendre();
    await userEvent.type(screen.getByRole('textbox', { name: 'Nom de la recette' }), 'Pain perdu');
    await userEvent.type(screen.getByRole('textbox', { name: 'Ingrédient 1' }), 'lait');
    await userEvent.type(screen.getByRole('textbox', { name: 'Quantité (Ingrédient 1)' }), '0,5');
    await userEvent.click(screen.getByRole('button', { name: 'Ajouter un ingrédient' }));
    expect(screen.getByRole('textbox', { name: 'Ingrédient 4' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: "Retirer l'ingrédient 4" }));
    expect(screen.queryByRole('textbox', { name: 'Ingrédient 4' })).not.toBeInTheDocument();
    await userEvent.type(screen.getByRole('textbox', { name: 'Étape 1' }), 'Tremper le pain.');
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer la recette' }));

    expect(onEnregistrer).toHaveBeenCalledOnce();
    const [valeurs] = onEnregistrer.mock.calls[0] as [typeof VALEURS_NOUVELLE_RECETTE];
    expect(valeurs.titre).toBe('Pain perdu');
    expect(valeurs.ingredients[0]).toEqual({ nom: 'lait', quantite: '0,5', unite: '' });
    expect(valeurs.ingredients).toHaveLength(3);
  });
});
