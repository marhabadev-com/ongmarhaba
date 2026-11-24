# Site web de l’ONG Marhaba

Site vitrine de l’ONG Marhaba (Développement communautaire, Niger) : 100 % statique (HTML, CSS, JavaScript), sans dépendance ni étape de compilation.

## Aperçu local

Ouvrir `index.html` dans un navigateur, ou lancer un petit serveur :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Mise en ligne avec GitHub Pages

1. Sur GitHub : **Settings → Pages**.
2. *Source* : « Deploy from a branch », branche `main`, dossier `/ (root)`.
3. Le site sera publié sur `https://marhabaneong.github.io/ongmarhabane/`.

## Structure

```
index.html              page unique (toutes les sections)
assets/css/style.css    styles (palette verte du logo)
assets/js/main.js       menu, diaporama, compteurs, galerie, visionneuse, formulaire
assets/img/             logo, favicons, photos (photos/ = grand format, thumbs/ = vignettes)
assets/docs/            notes d’information COFOB et SCAP/RU (PDF)
```

## Informations à compléter

Les éléments à compléter sont signalés sur le site par un fond hachuré et le texte entre crochets `[...]`.
Rechercher `class="todo"` dans `index.html` :

- adresse du siège (non affichée pour l’instant).

## Ajouter des photos

1. Redimensionner l’image (1600 px max pour `photos/`, 640 px pour `thumbs/`), même nom de fichier dans les deux dossiers.
2. Ajouter une ligne dans le tableau `PHOTOS` de `assets/js/main.js` : `["nom-du-fichier", "categorie", "Légende"]`.
   Catégories : `agri`, `formation`, `dotation`, `appui`.

## Formulaire de contact

Le site étant statique, le formulaire ouvre la messagerie du visiteur avec un e-mail prérempli adressé à `ongmarh@yahoo.com` (copie à `marhabaneong@gmail.com`).
Pour recevoir les messages directement, on peut brancher un service comme Formspree en changeant l’attribut `action` du formulaire.
