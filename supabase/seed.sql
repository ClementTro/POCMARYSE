-- Maryse & Co — recettes de démo (user_id nul : visibles par toutes les connectées, non modifiables)
-- À exécuter après 0001_init.sql. Rejouable : les recettes sont mises à jour par leur identifiant.

insert into public.recipes
  (id, user_id, title, description, servings, prep_minutes, cook_minutes, difficulty, tags, ingredients, steps)
values
(
  'd0000000-0000-4000-8000-000000000001', null,
  'Blanquette de veau à l''ancienne',
  'Le plat du dimanche chez Maryse, qui mijote pendant qu''on met la table.',
  6, 30, 120, 'moyen', array['plat', 'mijoté', 'dimanche'],
  '[{"name":"épaule de veau","quantity":1.2,"unit":"kg"},{"name":"carotte","quantity":3,"unit":""},{"name":"oignon","quantity":1,"unit":""},{"name":"champignon de Paris","quantity":250,"unit":"g"},{"name":"crème fraîche","quantity":20,"unit":"cl"},{"name":"jaune d''œuf","quantity":2,"unit":""},{"name":"beurre","quantity":40,"unit":"g"},{"name":"farine","quantity":40,"unit":"g"},{"name":"bouquet garni","quantity":1,"unit":""}]',
  '["Couper la viande en morceaux, la couvrir d''eau froide et porter à ébullition. Écumer.","Ajouter les carottes en rondelles, l''oignon et le bouquet garni. Laisser mijoter 1 h 30 à couvert.","Faire revenir les champignons au beurre.","Préparer un roux avec le beurre et la farine, le mouiller avec 50 cl de bouillon de cuisson.","Hors du feu, ajouter la crème et les jaunes, puis la viande, les légumes et les champignons. Servir avec du riz."]'
),
(
  'd0000000-0000-4000-8000-000000000002', null,
  'Gratin dauphinois',
  'Sans fromage, comme dans le Dauphiné : juste des pommes de terre, du lait et de la crème.',
  6, 20, 60, 'facile', array['accompagnement', 'four', 'végétarien'],
  '[{"name":"pomme de terre","quantity":1.2,"unit":"kg"},{"name":"lait entier","quantity":50,"unit":"cl"},{"name":"crème fraîche","quantity":25,"unit":"cl"},{"name":"gousse d''ail","quantity":1,"unit":""},{"name":"beurre","quantity":20,"unit":"g"},{"name":"noix de muscade","quantity":1,"unit":"pincée"}]',
  '["Préchauffer le four à 160 °C. Frotter le plat avec l''ail puis le beurrer.","Éplucher les pommes de terre et les couper en fines rondelles, sans les laver.","Les faire cuire 10 min dans le lait avec la muscade, sel et poivre.","Verser dans le plat, napper de crème et enfourner 1 h."]'
),
(
  'd0000000-0000-4000-8000-000000000003', null,
  'Quiche lorraine',
  'La quiche des soirs pressés, avec une salade verte.',
  6, 20, 40, 'facile', array['plat', 'four'],
  '[{"name":"pâte brisée","quantity":1,"unit":""},{"name":"lardons","quantity":200,"unit":"g"},{"name":"œuf","quantity":3,"unit":""},{"name":"crème fraîche","quantity":20,"unit":"cl"},{"name":"lait entier","quantity":20,"unit":"cl"},{"name":"noix de muscade","quantity":1,"unit":"pincée"}]',
  '["Préchauffer le four à 200 °C et foncer un moule avec la pâte.","Faire revenir les lardons à sec et les répartir sur la pâte.","Battre les œufs avec la crème, le lait, la muscade et du poivre.","Verser sur les lardons et cuire 35 à 40 min."]'
),
(
  'd0000000-0000-4000-8000-000000000004', null,
  'Hachis parmentier',
  'Celui que les enfants réclament, gratiné juste ce qu''il faut.',
  6, 30, 30, 'facile', array['plat', 'four', 'enfants'],
  '[{"name":"pomme de terre","quantity":1,"unit":"kg"},{"name":"bœuf haché","quantity":600,"unit":"g"},{"name":"oignon","quantity":2,"unit":""},{"name":"lait entier","quantity":20,"unit":"cl"},{"name":"beurre","quantity":50,"unit":"g"},{"name":"emmental râpé","quantity":80,"unit":"g"}]',
  '["Cuire les pommes de terre à l''eau salée puis les écraser avec le lait et le beurre.","Faire revenir les oignons émincés, ajouter la viande et cuire 10 min.","Dans un plat, étaler la viande puis la purée. Parsemer d''emmental.","Gratiner 20 min à 200 °C."]'
),
(
  'd0000000-0000-4000-8000-000000000005', null,
  'Soupe de légumes du jardin',
  'Tout ce qui reste dans le bac à légumes finit ici, et personne ne s''en plaint.',
  4, 20, 40, 'facile', array['entrée', 'végétarien', 'hiver'],
  '[{"name":"poireau","quantity":2,"unit":""},{"name":"carotte","quantity":3,"unit":""},{"name":"pomme de terre","quantity":3,"unit":""},{"name":"navet","quantity":1,"unit":""},{"name":"oignon","quantity":1,"unit":""},{"name":"crème fraîche","quantity":10,"unit":"cl"}]',
  '["Laver et couper tous les légumes en morceaux.","Les couvrir d''eau (environ 1,5 l), saler et cuire 40 min.","Mixer, ajouter la crème et rectifier l''assaisonnement."]'
),
(
  'd0000000-0000-4000-8000-000000000006', null,
  'Poulet rôti du dimanche',
  'La peau croustillante, le jus pour les pommes de terre : le rituel du dimanche midi.',
  6, 15, 90, 'facile', array['plat', 'four', 'dimanche'],
  '[{"name":"poulet fermier","quantity":1.6,"unit":"kg"},{"name":"pomme de terre grenaille","quantity":800,"unit":"g"},{"name":"gousse d''ail","quantity":4,"unit":""},{"name":"thym","quantity":3,"unit":"brin"},{"name":"beurre","quantity":30,"unit":"g"},{"name":"huile d''olive","quantity":2,"unit":"c. à soupe"}]',
  '["Préchauffer le four à 210 °C. Sortir le poulet du réfrigérateur 30 min avant.","Glisser le thym et 2 gousses d''ail à l''intérieur, enduire de beurre, saler, poivrer.","Disposer les pommes de terre et le reste de l''ail autour avec l''huile.","Enfourner 1 h 30 en arrosant toutes les 20 min. Laisser reposer 10 min avant de découper."]'
),
(
  'd0000000-0000-4000-8000-000000000007', null,
  'Crêpes de la Chandeleur',
  'Une quinzaine de crêpes, si personne ne les mange au fur et à mesure.',
  4, 10, 30, 'facile', array['dessert', 'goûter', 'végétarien', 'enfants'],
  '[{"name":"farine","quantity":250,"unit":"g"},{"name":"œuf","quantity":4,"unit":""},{"name":"lait entier","quantity":50,"unit":"cl"},{"name":"beurre","quantity":50,"unit":"g"},{"name":"sucre","quantity":30,"unit":"g"},{"name":"sel","quantity":1,"unit":"pincée"}]',
  '["Mélanger la farine, le sucre et le sel. Ajouter les œufs puis le lait petit à petit.","Incorporer le beurre fondu et laisser reposer 1 h.","Cuire les crêpes dans une poêle chaude légèrement beurrée, 1 min de chaque côté."]'
),
(
  'd0000000-0000-4000-8000-000000000008', null,
  'Gâteau au yaourt',
  'On mesure tout avec le pot de yaourt : la première recette que Maryse a apprise à ses enfants.',
  8, 10, 35, 'facile', array['dessert', 'goûter', 'enfants', 'végétarien'],
  '[{"name":"yaourt nature","quantity":1,"unit":"pot"},{"name":"farine","quantity":3,"unit":"pot"},{"name":"sucre","quantity":2,"unit":"pot"},{"name":"huile de tournesol","quantity":0.5,"unit":"pot"},{"name":"œuf","quantity":3,"unit":""},{"name":"levure chimique","quantity":1,"unit":"sachet"}]',
  '["Préchauffer le four à 180 °C et beurrer un moule.","Verser le yaourt dans un saladier puis, avec le pot, ajouter le sucre, les œufs, la farine, la levure et l''huile.","Mélanger jusqu''à obtenir une pâte lisse, verser dans le moule et cuire 35 min."]'
),
(
  'd0000000-0000-4000-8000-000000000009', null,
  'Pâtes à la bolognaise',
  'La sauce se prépare en double : une moitié pour ce soir, l''autre pour le congélateur.',
  4, 15, 45, 'facile', array['plat', 'enfants'],
  '[{"name":"spaghettis","quantity":400,"unit":"g"},{"name":"bœuf haché","quantity":400,"unit":"g"},{"name":"tomates concassées","quantity":800,"unit":"g"},{"name":"oignon","quantity":1,"unit":""},{"name":"carotte","quantity":1,"unit":""},{"name":"gousse d''ail","quantity":2,"unit":""},{"name":"huile d''olive","quantity":2,"unit":"c. à soupe"}]',
  '["Faire revenir l''oignon, la carotte et l''ail hachés dans l''huile.","Ajouter la viande et la faire dorer.","Verser les tomates, saler, poivrer et laisser mijoter 40 min à feu doux.","Cuire les pâtes et servir avec la sauce."]'
),
(
  'd0000000-0000-4000-8000-000000000010', null,
  'Tarte aux pommes',
  'Les pommes en rosace, et la compote cachée dessous.',
  8, 30, 40, 'moyen', array['dessert', 'four', 'végétarien'],
  '[{"name":"pâte brisée","quantity":1,"unit":""},{"name":"pomme","quantity":6,"unit":""},{"name":"sucre","quantity":60,"unit":"g"},{"name":"beurre","quantity":30,"unit":"g"},{"name":"sucre vanillé","quantity":1,"unit":"sachet"}]',
  '["Préchauffer le four à 190 °C et foncer un moule avec la pâte.","Faire une compote rapide avec 3 pommes, la moitié du sucre et le sucre vanillé. L''étaler sur la pâte.","Couper les autres pommes en lamelles et les disposer en rosace.","Parsemer de beurre et du reste de sucre. Cuire 40 min."]'
),
(
  'd0000000-0000-4000-8000-000000000011', null,
  'Ratatouille',
  'Encore meilleure le lendemain, froide ou réchauffée.',
  6, 30, 60, 'facile', array['plat', 'végétarien', 'été'],
  '[{"name":"aubergine","quantity":2,"unit":""},{"name":"courgette","quantity":3,"unit":""},{"name":"poivron","quantity":2,"unit":""},{"name":"tomate","quantity":5,"unit":""},{"name":"oignon","quantity":2,"unit":""},{"name":"gousse d''ail","quantity":3,"unit":""},{"name":"huile d''olive","quantity":6,"unit":"c. à soupe"},{"name":"herbes de Provence","quantity":1,"unit":"c. à soupe"}]',
  '["Couper tous les légumes en cubes.","Faire revenir séparément aubergines, courgettes et poivrons dans l''huile.","Faire fondre les oignons et l''ail, ajouter les tomates puis tous les légumes.","Ajouter les herbes, saler, poivrer et laisser mijoter 45 min à couvert."]'
),
(
  'd0000000-0000-4000-8000-000000000012', null,
  'Croque-monsieur',
  'Le dîner du vendredi soir, devant un film en famille.',
  4, 10, 10, 'facile', array['plat', 'rapide', 'enfants'],
  '[{"name":"pain de mie","quantity":8,"unit":"tranche"},{"name":"jambon blanc","quantity":4,"unit":"tranche"},{"name":"emmental râpé","quantity":120,"unit":"g"},{"name":"beurre","quantity":30,"unit":"g"},{"name":"crème fraîche","quantity":4,"unit":"c. à soupe"}]',
  '["Beurrer les tranches de pain sur une face.","Garnir 4 tranches de jambon, de crème et de fromage, refermer.","Parsemer le dessus de fromage et cuire 10 min à 220 °C."]'
),
(
  'd0000000-0000-4000-8000-000000000013', null,
  'Salade niçoise',
  'Pour les midis d''été sur la terrasse.',
  4, 20, 10, 'facile', array['entrée', 'été', 'rapide'],
  '[{"name":"tomate","quantity":4,"unit":""},{"name":"œuf","quantity":4,"unit":""},{"name":"thon au naturel","quantity":200,"unit":"g"},{"name":"haricots verts","quantity":200,"unit":"g"},{"name":"olives noires","quantity":80,"unit":"g"},{"name":"salade","quantity":1,"unit":""},{"name":"huile d''olive","quantity":4,"unit":"c. à soupe"}]',
  '["Cuire les œufs 10 min et les haricots verts 8 min. Refroidir.","Couper les tomates et les œufs en quartiers.","Disposer la salade, les légumes, le thon et les olives. Assaisonner d''huile d''olive."]'
),
(
  'd0000000-0000-4000-8000-000000000014', null,
  'Bœuf bourguignon',
  'À lancer le samedi pour le dimanche : il n''en sera que meilleur.',
  6, 30, 180, 'moyen', array['plat', 'mijoté', 'dimanche'],
  '[{"name":"paleron de bœuf","quantity":1.5,"unit":"kg"},{"name":"vin rouge","quantity":75,"unit":"cl"},{"name":"lardons","quantity":150,"unit":"g"},{"name":"carotte","quantity":3,"unit":""},{"name":"oignon","quantity":2,"unit":""},{"name":"champignon de Paris","quantity":250,"unit":"g"},{"name":"farine","quantity":2,"unit":"c. à soupe"},{"name":"bouquet garni","quantity":1,"unit":""}]',
  '["Faire dorer la viande en morceaux avec les lardons, puis les oignons.","Saupoudrer de farine, mélanger, puis mouiller avec le vin.","Ajouter les carottes et le bouquet garni. Laisser mijoter 3 h à feu très doux.","Ajouter les champignons 30 min avant la fin."]'
),
(
  'd0000000-0000-4000-8000-000000000015', null,
  'Clafoutis aux cerises',
  'Avec les noyaux, comme dans le Limousin : ça parfume, mais on prévient les invités.',
  6, 15, 40, 'facile', array['dessert', 'été', 'végétarien'],
  '[{"name":"cerise","quantity":500,"unit":"g"},{"name":"œuf","quantity":3,"unit":""},{"name":"farine","quantity":80,"unit":"g"},{"name":"sucre","quantity":80,"unit":"g"},{"name":"lait entier","quantity":30,"unit":"cl"},{"name":"beurre","quantity":20,"unit":"g"}]',
  '["Préchauffer le four à 180 °C. Beurrer un plat et y répartir les cerises.","Fouetter les œufs et le sucre, ajouter la farine puis le lait.","Verser sur les cerises et cuire 40 min."]'
),
(
  'd0000000-0000-4000-8000-000000000016', null,
  'Omelette aux fines herbes',
  'Cinq minutes montre en main, pour les soirs où le frigo est presque vide.',
  2, 5, 5, 'facile', array['plat', 'rapide', 'végétarien'],
  '[{"name":"œuf","quantity":4,"unit":""},{"name":"ciboulette","quantity":0.5,"unit":"botte"},{"name":"persil","quantity":0.5,"unit":"botte"},{"name":"beurre","quantity":15,"unit":"g"}]',
  '["Battre les œufs avec les herbes ciselées, du sel et du poivre.","Faire mousser le beurre dans une poêle, verser les œufs.","Cuire à feu moyen en ramenant les bords vers le centre, plier et servir baveuse."]'
),
(
  'd0000000-0000-4000-8000-000000000017', null,
  'Riz au lait de mamie',
  'La recette de la grand-mère de Maryse, recopiée trois fois dans le cahier.',
  6, 5, 45, 'facile', array['dessert', 'enfants', 'végétarien'],
  '[{"name":"riz rond","quantity":150,"unit":"g"},{"name":"lait entier","quantity":1,"unit":"l"},{"name":"sucre","quantity":80,"unit":"g"},{"name":"gousse de vanille","quantity":1,"unit":""}]',
  '["Porter le lait à frémissement avec la vanille fendue.","Ajouter le riz et cuire 40 min à feu très doux en remuant souvent.","Ajouter le sucre en fin de cuisson. Servir tiède ou froid."]'
),
(
  'd0000000-0000-4000-8000-000000000018', null,
  'Velouté de potiron',
  'Le premier velouté de l''automne, servi avec des croûtons.',
  4, 15, 30, 'facile', array['entrée', 'végétarien', 'automne'],
  '[{"name":"potiron","quantity":1,"unit":"kg"},{"name":"pomme de terre","quantity":2,"unit":""},{"name":"oignon","quantity":1,"unit":""},{"name":"crème fraîche","quantity":10,"unit":"cl"},{"name":"bouillon de légumes","quantity":1,"unit":"l"}]',
  '["Faire revenir l''oignon émincé.","Ajouter le potiron et les pommes de terre en cubes, puis le bouillon.","Cuire 30 min, mixer et ajouter la crème."]'
),
(
  'd0000000-0000-4000-8000-000000000019', null,
  'Lasagnes maison',
  'Un grand plat pour huit : idéal quand toute la famille débarque.',
  8, 40, 45, 'moyen', array['plat', 'four', 'enfants'],
  '[{"name":"feuilles de lasagne","quantity":12,"unit":""},{"name":"bœuf haché","quantity":600,"unit":"g"},{"name":"tomates concassées","quantity":800,"unit":"g"},{"name":"lait entier","quantity":75,"unit":"cl"},{"name":"beurre","quantity":60,"unit":"g"},{"name":"farine","quantity":60,"unit":"g"},{"name":"emmental râpé","quantity":150,"unit":"g"},{"name":"oignon","quantity":1,"unit":""}]',
  '["Préparer une sauce bolognaise avec l''oignon, la viande et les tomates (30 min).","Préparer une béchamel avec le beurre, la farine et le lait.","Alterner dans un plat : sauce, feuilles, béchamel. Terminer par la béchamel et le fromage.","Cuire 45 min à 180 °C."]'
),
(
  'd0000000-0000-4000-8000-000000000020', null,
  'Mousse au chocolat',
  'À préparer la veille : la tentation de goûter avant le dessert est le seul risque.',
  6, 20, 0, 'facile', array['dessert', 'végétarien'],
  '[{"name":"chocolat noir","quantity":200,"unit":"g"},{"name":"œuf","quantity":6,"unit":""},{"name":"sucre","quantity":30,"unit":"g"},{"name":"sel","quantity":1,"unit":"pincée"}]',
  '["Faire fondre le chocolat au bain-marie et le laisser tiédir.","Séparer les blancs des jaunes. Incorporer les jaunes au chocolat.","Monter les blancs en neige avec le sel, ajouter le sucre.","Incorporer délicatement les blancs au chocolat. Réserver au moins 4 h au frais."]'
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  servings = excluded.servings,
  prep_minutes = excluded.prep_minutes,
  cook_minutes = excluded.cook_minutes,
  difficulty = excluded.difficulty,
  tags = excluded.tags,
  ingredients = excluded.ingredients,
  steps = excluded.steps;
