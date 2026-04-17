# Club Découverte — Site web

Site officiel du **Club Découverte** de l'ESAIP Aix-en-Provence.  
Activités, carte interactive, calendrier, galerie photo et contact.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Structure | HTML5 sémantique (6 pages) |
| Style | CSS3 — variables custom, grid, flexbox — fichier unique `assets/styles.css` |
| Logique | Vanilla JS — `assets/app.js` (aucune dépendance) |
| Données | `assets/data.js` — objet global `window.clubData` |
| Carte | [Leaflet.js](https://leafletjs.com/) 1.9.4 + tuiles CartoDB Voyager |
| Polices | **Atkinson Hyperlegible** (corps) + **Lexend** (titres) — Google Fonts, adaptées DYS |
| Formulaires | [Web3Forms](https://web3forms.com/) (optionnel) — fallback `mailto:` |
| Persistance | `localStorage` (inscriptions, intérêts, newsletter) |
| Hébergement | [Vercel](https://vercel.com/) — site statique, aucun backend |

---

## Structure du projet

```
CDD/
├── main.html                 # Accueil — hero, stats, aperçu activités, équipe, FAQ
├── activites.html            # Catalogue filtrable + carte Leaflet des activités
├── calendrier.html           # Calendrier mensuel des événements
├── galerie.html              # Galerie photos des sorties
├── contact.html              # Formulaire de contact
├── mentions-legales.html     # Mentions légales & politique de confidentialité
├── vercel.json               # Rewrite / → main.html
└── assets/
    ├── data.js               # ← Toutes les données (activités, membres, galerie, events)
    ├── app.js                # Logique JS (carte, filtres, modals, calendrier, galerie…)
    ├── styles.css            # Styles globaux (thème, composants, responsive)
    ├── logo_club_decouvertes.png
    ├── logo-bdp-esaip-aix.png
    ├── [photos membres].jpg/png
    ├── granet/               # 7 photos — Musée Granet
    ├── bederie/              # 7 photos — La Béderie
    ├── escalade/             # 7 photos — Bloc Session
    └── 6mic/                 # 4 photos — 6MIC
```

---

## Lancer en local

Aucune installation requise. Un serveur local est nécessaire pour éviter les restrictions `file://` (images, JS modules) :

**VS Code — Live Server**
1. Installer l'extension [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Clic droit sur `main.html` → **Open with Live Server**

**Python**
```bash
cd CDD
python3 -m http.server 8080
# → http://localhost:8080
```

**Node**
```bash
npx serve .
```

---

## Modifier les données

Toutes les données sont centralisées dans [`assets/data.js`](assets/data.js) — objet `window.clubData`.  
Aucun backend, aucune base de données.

### Ajouter une activité

```js
// assets/data.js > activities: [...]
{
  id: 'act-mon-id',            // identifiant unique (kebab-case)
  title: 'Nom de l\'activité',
  category: 'Culture locale',  // alimente le filtre automatiquement
  level: 'Tous niveaux',
  duration: '2h',
  meetingPoint: 'Adresse complète',
  nextDate: 'AAAA-MM-JJ',     // utilisé en interne (calendrier) — non affiché sur la page Activités
  priceMember: 0,              // 0 = gratuit membres
  priceGuest: 5,
  slots: 20,
  image: 'assets/dossier/photo.jpg',
  imageAlt: 'Description de l\'image',
  imageCredit: '',
  imageCreditUrl: '',
  instagramUrl: 'https://www.instagram.com/p/...',
  description: 'Description affichée sur la carte et dans la modale.',
  lat: 43.5253,                // coordonnées GPS (marqueur carte)
  lng: 5.4529
}
```

### Ajouter un événement au calendrier

```js
// assets/data.js > events: [...]
{
  id: 'evt-mon-id',
  title: 'Nom de l\'événement',
  date: 'AAAA-MM-JJ',
  time: '20h00',
  place: 'Lieu, Aix-en-Provence',
  type: 'Concert',
  featured: true,              // true = affichage en gros dans le calendrier
  image: 'assets/dossier/photo.jpg',
  imageAlt: 'Description',
  description: 'Description affichée dans la modale.',
  instagramUrl: 'https://www.instagram.com/p/...',
  slots: 50
}
```

### Ajouter une photo en galerie

```js
// assets/data.js > gallery: [...]
{
  title: 'Titre affiché',
  caption: 'Légende de la photo.',
  image: 'assets/dossier/photo.jpg',
  imageAlt: 'Description alt'
}
```

### Modifier les membres

Dans `assets/data.js` > section `members` — mettre à jour `name`, `role`, `photo` (chemin relatif `assets/`) et `color` (couleur de l'avatar fallback).

---

## Accessibilité DYS

Les polices ont été choisies pour faciliter la lecture aux personnes dyslexiques, dyspraxiques et dysorthographiques :

- **Atkinson Hyperlegible** (corps de texte) — conçue par le Braille Institute, chaque lettre est clairement distincte pour éviter les confusions visuelles
- **Lexend** (titres et UI) — conçue pour réduire la charge cognitive de lecture, validée par des études cliniques

Ces deux polices sont disponibles gratuitement sur Google Fonts et ne dégradent pas le rendu visuel du site.

---

## Carte interactive (Leaflet)

- Tuiles **CartoDB Voyager** — style épuré, sans clé API
- Marqueur **ESAIP** avec logo officiel + popup adresse
- Marqueurs **activités** : photo de couverture en format circulaire, bordure colorée par catégorie, popup avec image, tarif et lien Instagram
- Scroll à la molette désactivé sur la carte (pour ne pas bloquer le scroll de page)

Catégories et couleurs :

| Catégorie | Couleur |
|---|---|
| Nature | `#059669` (vert) |
| Culture locale | `#7c3aed` (violet) |
| Musique | `#db2777` (rose) |
| Sport | `#0071e3` (bleu) |
| Aventure | `#ea580c` (orange) |
| Créatif | `#d97706` (ambre) |

---

## Formulaire de contact / inscriptions

Par défaut, les formulaires ouvrent le client mail (`mailto:`).  
Pour activer l'envoi automatique sans ouvrir de messagerie :

1. Créer un compte sur [web3forms.com](https://web3forms.com/) et récupérer la clé d'accès
2. Dans `assets/data.js` > objet `club`, ajouter :
```js
web3formsKey: 'VOTRE_CLE_ICI'
```

---

## Déploiement (Vercel)

Le fichier `vercel.json` redirige `/` vers `main.html` pour le routing statique :

```json
{
  "rewrites": [
    { "source": "/", "destination": "/main.html" }
  ]
}
```

Tout push sur `main` déclenche un déploiement automatique.

---

## Équipe

| Nom | Rôle |
|---|---|
| Paul LAMBLIN | Développeur |
| Clément MARCO | Développeur |
| Amine BENBOUCHTA | Président du club |
| Ruben COHEN | Trésorier |
| Sacha ROSTAING | Chef de Route / Partenariat |
| Ikram AYAD | Responsable Communication |
| Emmeline WAGNER | Membre |
| Mouad DERRAZ | Membre |

---

*Site réalisé par Paul LAMBLIN et Clément MARCO, ING2 ESAIP Aix-en-Provence*
