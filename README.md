# Club de Découverte — Site web

Site officiel du **Club de Découverte** de l'ESAIP Aix-en-Provence.  
Présente les activités, la carte interactive, le calendrier, la galerie et les contacts du club.

---

## Stack technique

| Couche | Techno |
|---|---|
| Structure | HTML5 sémantique |
| Style | CSS3 (variables, grid, flexbox) — fichier unique `assets/styles.css` |
| Logique | Vanilla JS — `assets/app.js` |
| Données | `assets/data.js` (objet global `window.clubData`) |
| Carte | [Leaflet.js](https://leafletjs.com/) 1.9.4 + tuiles CartoDB Voyager |
| Icônes map | Favicons/logos officiels des lieux |
| Hébergement | Statique — aucun backend requis |

---

## Structure du projet

```
CDD/
├── main.html             # Page d'accueil
├── activites.html        # Catalogue + carte des activités
├── calendrier.html       # Calendrier des événements
├── galerie.html          # Galerie photos + témoignages
├── contact.html          # Formulaire de contact
├── mentions-legales.html # Mentions légales
├── adhesion.html         # (conservé mais non lié dans la nav)
└── assets/
    ├── data.js           # ← TOUTES les données du club (activités, membres, galerie…)
    ├── app.js            # Logique JS (carte, filtres, modals, calendrier…)
    ├── styles.css        # Styles globaux
    ├── logo-bdp-esaip-aix.png
    └── [photos membres]
```

---

## Lancer le site en local

Aucune installation requise. Ouvrir avec un serveur local pour éviter les restrictions `file://` :

**Option 1 — VS Code Live Server**
1. Installer l'extension [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Clic droit sur `main.html` → **Open with Live Server**

**Option 2 — Python**
```bash
cd CDD
python3 -m http.server 8080
# Ouvrir http://localhost:8080/main.html
```

---

## Modifier les données

Toutes les données sont centralisées dans [`assets/data.js`](assets/data.js).  
Aucun backend, aucune base de données — tout est dans cet objet JS.

### Ajouter une activité

```js
// Dans assets/data.js > activities: [...]
{
  id: 'act-mon-id-unique',
  title: 'Nom de l activite',
  category: 'Culture locale',   // filtre automatique
  level: 'Tous niveaux',
  duration: '2h',
  meetingPoint: 'Adresse du lieu',
  nextDate: 'AAAA-MM-JJ',
  priceMember: 0,               // 0 = gratuit étudiants
  priceGuest: 5,
  slots: 20,
  image: 'https://...',
  imageAlt: 'Description image',
  instagramUrl: 'https://www.instagram.com/p/...',
  description: 'Description courte.',
  lat: 43.5253,                 // coordonnées GPS pour la carte
  lng: 5.4529
}
```

### Modifier les membres

Dans `assets/data.js` > section `members`, mettre à jour `name`, `role` et `photo` (chemin relatif vers `assets/`).

---

## Carte interactive (Leaflet)

- Tuiles **CartoDB Voyager** (style Google Maps, gratuit, sans clé API)
- Marqueur **ESAIP** avec logo officiel
- Marqueurs par activité avec logo du lieu et popup (adresse, tarif, lien Instagram)
- Zoom désactivé à la molette (pour ne pas bloquer le scroll de page)

---

## Contribuer

1. Cloner le repo
```bash
git clone https://github.com/Pololego29/CDD.git
```
2. Créer une branche
```bash
git checkout -b feat/ma-modification
```
3. Modifier `assets/data.js` ou les pages HTML/CSS
4. Pousser et ouvrir une Pull Request

---

## Équipe

| Nom | Rôle |
|---|---|
| Paul LAMBLIN | Président & Chef de dev |
| Clément MARCO | Chef de dev adjoint |
| Amine BENBOUCHTA | Trésorier |
| Emmeline WAGNER | Secrétaire |
| Mouad DERRAZ | Resp. sorties |
| Ruben COHEN | Trésorier |
| Sacha ROSTAING | Événements |
| Ikram AYAD | Resp. communication |

---

*Site réalisé par Paul LAMBLIN, ING2 ESAIP Aix-en-Provence*
