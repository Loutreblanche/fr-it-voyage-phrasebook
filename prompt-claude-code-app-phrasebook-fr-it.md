# Prompt pour Claude Code — Appli phrasebook FR ⇄ IT (PWA hors-ligne)

## Contexte
Je veux une petite application web simple, sous forme de **PWA installable et utilisable hors-ligne**, qui fonctionne comme un **répertoire de phrases** pour un voyage touristique entre la France et l'Italie. Ce n'est PAS un traducteur généraliste : les phrases sont fixes, pré-traduites, pas de saisie libre de texte à traduire.

## Objectif
Une appli mobile-first, simple, agréable, qui permette de :
- Consulter des phrases courantes classées par catégories, en français et en italien, dans les deux sens.
- Écouter la prononciation de chaque phrase (texte → voix).
- Utiliser l'appli **sans connexion internet** une fois installée sur le téléphone.

## Contenu à générer
Génère un jeu d'environ **114 phrases courantes et utiles pour un voyage touristique**, classées dans ces catégories (avec le nombre indicatif de phrases par catégorie) :

- Salutations & politesse (10)
- Se présenter / petites conversations (8)
- Transports : aéroport, gare, taxi (12)
- Hébergement : hôtel (10)
- Au restaurant : commander, demander la carte, l'addition, remercier/complimenter (12)
- Bar / café / boissons (6)
- Marché / épicerie / achats alimentaires (6)
- Allergies / régimes spécifiques (végétarien, sans gluten, allergies courantes) (5)
- Achats / shopping non alimentaire (10)
- Se repérer / demander son chemin (10)
- Urgences / santé (10)
- Nombres, heure, argent (10)
- Expressions utiles diverses (5)
- **Lexique alimentaire (mots isolés, pas des phrases, utiles pour lire une carte de restaurant) (50)** :
  - Viandes & volailles (8)
  - Poissons & fruits de mer (6)
  - Légumes (8)
  - Fruits (6)
  - Produits laitiers & fromages (5)
  - Céréales / féculents / pain (5)
  - Boissons (6)
  - Modes de cuisson / termes de carte (ex : "grillé", "farci", "à la vapeur") (6)

Le total du contenu passe donc à environ **164 entrées** (114 phrases + 50 termes de lexique). Les entrées du lexique utilisent la même structure de données que les phrases (`fr` / `it` / `categorie`), simplement avec un mot ou groupe nominal court au lieu d'une phrase complète — pas besoin de structure différente.

**Exigences de qualité sur les traductions :**
- Français et italien naturels, de niveau courant, adaptés à un usage touristique poli (pas de tournures littéraires ni trop familières).
- Utiliser le vouvoiement en français et la forme de politesse correspondante en italien (Lei), cohérente avec un usage entre inconnus (commerçants, hôtel, etc.), sauf pour la catégorie "se présenter" où un registre neutre convient.
- Vérifie la cohérence et l'exactitude des traductions (pas de traduction mot à mot approximative).
- Chaque phrase doit être stockée sous cette forme dans les données de l'appli :
```json
{ "id": "unique-id", "categorie": "restaurant", "fr": "L'addition, s'il vous plaît.", "it": "Il conto, per favore." }
```

## Fonctionnalités attendues
1. **Sélecteur de sens** : un bouton/switch clair en haut de l'écran pour basculer entre 🇫🇷→🇮🇹 et 🇮🇹→🇫🇷 (la langue "source" affichée en premier, la langue "cible" en dessous ou au clic).
2. **Navigation par catégories** : liste des catégories avec icônes simples, puis liste des phrases de la catégorie sélectionnée.
3. **Recherche** : une barre de recherche qui filtre les phrases par mot-clé, dans les deux langues.
4. **Écoute audio (Text-to-Speech)** : un bouton haut-parleur à côté de chaque phrase (dans les deux langues), utilisant l'API native `SpeechSynthesis` du navigateur (`fr-FR` et `it-IT`). Pas d'API externe, pas de coût.
5. **Mode clair / sombre** : détection automatique de la préférence système + bouton pour basculer manuellement.
6. **Design mobile-first**, mais responsive pour fonctionner correctement sur PC également.
7. Interface simple, épurée, pas de fonctionnalités superflues.

## Contraintes techniques — PWA hors-ligne
- L'appli doit être une **Progressive Web App installable** :
  - `manifest.json` complet (nom, icônes, couleur de thème, mode `standalone`).
  - Un **service worker** qui met en cache tous les fichiers nécessaires (HTML, CSS, JS, données JSON, icônes) dès le premier chargement, pour un fonctionnement 100% hors-ligne ensuite.
  - Icônes d'appli (au moins 192x192 et 512x512), génériques et simples si je n'en fournis pas.
- Pas de backend, pas de base de données externe, pas d'API payante. Tout doit tourner en local dans le navigateur.
- Le code doit être propre, commenté, et organisé en fichiers séparés clairs (ex: `index.html`, `style.css`, `app.js`, `phrases.json`, `sw.js`, `manifest.json`).

## Outils à disposition
Tu es autorisé à utiliser librement tous les outils, skills ou connecteurs à ta disposition qui pourraient t'aider à mener ce projet à bien (recherche web pour vérifier une info technique, exécution de code pour tester/valider, etc.). N'hésite pas à t'en servir dès que c'est utile, sans me demander confirmation au préalable pour les usages en lecture seule ou de vérification.

## Vérifications automatiques avant chaque livraison
Avant de me présenter une version (initiale ou corrigée), exécute toi-même un script de validation qui vérifie :
- Que `phrases.json` est un JSON valide, que chaque entrée possède bien les champs `id`, `categorie`, `fr`, `it` non vides.
- Qu'il n'y a aucun `id` en double.
- Que le nombre d'entrées par catégorie correspond bien à ce qui est attendu dans ce prompt (à ~2 près).
- Que `manifest.json` contient tous les champs obligatoires (name, icons, start_url, display, theme_color, background_color).
- Que le service worker référence bien tous les fichiers réels du projet dans son cache (aucun fichier utilisé par l'appli oublié).

Si une vérification échoue, corrige avant de me livrer la version. Indique-moi en une ligne que ces vérifications sont passées avec succès. Ces vérifications techniques ne remplacent pas mes propres tests (audio, hors-ligne réel, ressenti d'usage), qui restent à ma charge après chaque livraison.

## Méthode de travail souhaitée
1. Avant de coder, confirme-moi brièvement ta compréhension du besoin et le plan de fichiers que tu vas créer.
2. Construis une première version fonctionnelle complète.
3. Explique les choix techniques importants (notamment pour le service worker et le TTS).
4. Indique-moi ensuite comment tester le fonctionnement hors-ligne sur mon téléphone (installation "Ajouter à l'écran d'accueil" + vérification en mode avion).
5. Propose, si pertinent, des améliorations simples pour la suite (ex : ajout de favoris, ajout d'autres catégories).

## Ce que je NE veux PAS
- Pas de traduction libre / champ de saisie de texte à traduire.
- Pas de reconnaissance vocale (speech-to-text).
- Pas d'API de traduction externe, pas de compte à créer, pas de coût récurrent.
- Pas de framework lourd inutile vu la taille du projet (privilégier HTML/CSS/JS simple, sauf si tu juges qu'un framework léger apporte un vrai bénéfice — dans ce cas, explique pourquoi avant de l'utiliser).
