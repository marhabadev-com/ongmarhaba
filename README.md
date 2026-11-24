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

## Application mobile

Le site est une application web installable (PWA) : sur Android, le bouton « Installer l’application » apparaît dans le menu ;
sur iPhone, Safari → Partager → « Sur l’écran d’accueil ». L’application fonctionne aussi hors connexion pour les pages déjà vues.
Fichiers : `manifest.webmanifest`, `sw.js`, icônes `assets/img/icon-*.png`.

## Espace admin (ajouter ou supprimer des contenus)

Adresse : `https://marhabaneong.github.io/ongmarhabane/admin/`

Contenus modifiables sans code : actualités et publications, galerie photos, chiffres clés, partenaires, coordonnées.
Ils sont enregistrés dans le dossier `data/` (fichiers JSON) et les fichiers envoyés dans `assets/uploads/`.
Chaque enregistrement crée un commit sur GitHub ; le site se met à jour en 1 à 2 minutes.

### Se connecter

1. Avoir un compte GitHub avec le droit d’écriture sur le dépôt `marhabaneong/ongmarhabane`
   (le compte marhabaneong, ou un collaborateur ajouté dans Settings → Collaborators).
2. Créer un jeton d’accès : https://github.com/settings/personal-access-tokens/new
   - *Repository access* : « Only select repositories » → `ongmarhabane`
   - *Permissions* → *Contents* : « Read and write »
   - Choisir une date d’expiration, puis « Generate token » et copier le jeton.
3. Ouvrir l’espace admin, choisir **« Se connecter avec un jeton d’accès »** et coller le jeton.
   (Le bouton « Se connecter avec GitHub » demanderait un serveur d’authentification supplémentaire : ne pas l’utiliser.)

Ne partagez jamais le jeton. S’il est perdu, supprimez-le sur GitHub et créez-en un nouveau.

### Photos : toujours flouter les visages

Avant d’ajouter une photo, passez-la dans l’outil `admin/flouter.html` (« Flouter les visages ») :
il détecte les visages directement sur l’appareil, permet d’ajouter ceux qui manquent en touchant la photo,
puis enregistre une copie floutée à envoyer dans l’espace admin.
L’outil utilise le modèle de détection YuNet (OpenCV Zoo, licence MIT) et onnxruntime-web.

## Structure

```
index.html              page unique (toutes les sections)
data/                   contenus modifiables depuis l’espace admin (JSON)
admin/                  espace admin (Sveltia CMS) et outil de floutage des visages
assets/css/style.css    styles (palette verte du logo)
assets/js/main.js       menu, diaporama, compteurs, galerie, visionneuse, formulaire
assets/img/             logo, favicons, photos (photos/ = grand format, thumbs/ = vignettes)
assets/docs/            notes d’information COFOB et SCAP/RU (PDF)
```

## Informations à compléter

Les éléments à compléter sont signalés sur le site par un fond hachuré et le texte entre crochets `[...]`.
Rechercher `class="todo"` dans `index.html` :

- adresse du siège (non affichée pour l’instant).

## Formulaire de contact

Le site étant statique, le formulaire ouvre la messagerie du visiteur avec un e-mail prérempli adressé à `ongmarh@yahoo.com` (copie à `marhabaneong@gmail.com`).
Pour recevoir les messages directement, on peut brancher un service comme Formspree en changeant l’attribut `action` du formulaire.
