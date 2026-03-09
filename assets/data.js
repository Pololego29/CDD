window.clubData = {
  club: {
    name: 'Club de Découverte',
    city: 'Aix-en-Provence',
    email: 'clubdecouvertes.aix@esaip.org',
    phone: '+33 6 11 56 33 70',
    logo: 'assets/logo-bdp-esaip-aix.png'
  },
  activities: [
    {
      id: 'act-rando-victoire',
      title: 'Randonnee Sainte-Victoire',
      category: 'Nature',
      level: 'Intermediaire',
      duration: '3h30',
      meetingPoint: 'Parking du Tholonet',
      nextDate: '2026-02-14',
      priceMember: 0,
      priceGuest: 8,
      slots: 24,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Montagne_Sainte-Victoire.jpg',
      imageAlt: 'Vue de la montagne Sainte-Victoire',
      imageCredit: 'Photo: Axel Brocke (Wikimedia Commons)',
      imageCreditUrl: 'https://commons.wikimedia.org/wiki/File:Montagne_Sainte-Victoire.jpg',
      description: 'Sortie randonnee avec panorama sur le pays d Aix et briefing securite avant depart.'
    },
    {
      id: 'act-food-market',
      title: 'Tour des Halles et producteurs',
      category: 'Culture locale',
      level: 'Tous niveaux',
      duration: '2h',
      meetingPoint: 'Place Richelme',
      nextDate: '2026-02-20',
      priceMember: 5,
      priceGuest: 12,
      slots: 18,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Aix-en-Provence_(13)_Place_Richelme_940.jpg',
      imageAlt: 'Place Richelme a Aix-en-Provence',
      imageCredit: 'Photo: GFreihalter (Wikimedia Commons)',
      imageCreditUrl: 'https://commons.wikimedia.org/wiki/File:Aix-en-Provence_(13)_Place_Richelme_940.jpg',
      description: 'Decouverte des produits provencaux, degustations et rencontre de commercants locaux.'
    },
    {
      id: 'act-atelier-photo',
      title: 'Atelier photo urbaine',
      category: 'Creatif',
      level: 'Debutant',
      duration: '2h30',
      meetingPoint: 'Fontaine de la Rotonde',
      nextDate: '2026-03-01',
      priceMember: 6,
      priceGuest: 14,
      slots: 16,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Fontaine_de_la_Rotonde_-_Aix-en-Provence.JPG',
      imageAlt: 'Fontaine de la Rotonde a Aix-en-Provence',
      imageCredit: 'Photo: Rainbow0413 (Wikimedia Commons)',
      imageCreditUrl: 'https://commons.wikimedia.org/wiki/File:Fontaine_de_la_Rotonde_-_Aix-en-Provence.JPG',
      description: 'Session encadree pour apprendre cadrage, lumiere et composition dans le centre historique.'
    },
    {
      id: 'act-calanques',
      title: 'Excursion Calanques',
      category: 'Aventure',
      level: 'Confirme',
      duration: 'Journee',
      meetingPoint: 'Gare routiere Aix',
      nextDate: '2026-03-12',
      priceMember: 12,
      priceGuest: 22,
      slots: 30,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Calanque_d%27en_Vau.jpg',
      imageAlt: 'Vue sur la Calanque d en Vau',
      imageCredit: 'Photo: Dkiechle (Wikimedia Commons)',
      imageCreditUrl: 'https://commons.wikimedia.org/wiki/File:Calanque_d%27en_Vau.jpg',
      description: 'Sortie en minibus vers les Calanques avec parcours balise et pause pique-nique.'
    },
    {
      id: 'act-musee-granet',
      title: 'Soiree musee et patrimoine',
      category: 'Culture locale',
      level: 'Tous niveaux',
      duration: '2h',
      meetingPoint: 'Musee Granet',
      nextDate: '2026-03-18',
      priceMember: 4,
      priceGuest: 10,
      slots: 20,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mus%C3%A9e_Granet_Aix_en_Provence.jpg',
      imageAlt: 'Facade du Musee Granet',
      imageCredit: 'Photo: Didier Deveze (Wikimedia Commons)',
      imageCreditUrl: 'https://commons.wikimedia.org/wiki/File:Mus%C3%A9e_Granet_Aix_en_Provence.jpg',
      description: 'Parcours commente autour des collections d art et de l histoire d Aix-en-Provence.'
    },
    {
      id: 'act-cuisine',
      title: 'Atelier cuisine provencale',
      category: 'Creatif',
      level: 'Tous niveaux',
      duration: '3h',
      meetingPoint: 'Maison des Associations',
      nextDate: '2026-03-25',
      priceMember: 10,
      priceGuest: 18,
      slots: 14,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cours_Mirabeau,_Aix-en-Provence.jpg',
      imageAlt: 'Cours Mirabeau a Aix-en-Provence',
      imageCredit: 'Photo: Flickr upload bot (Wikimedia Commons)',
      imageCreditUrl: 'https://commons.wikimedia.org/wiki/File:Cours_Mirabeau,_Aix-en-Provence.jpg',
      description: 'Preparation de recettes locales en petits groupes avec chef partenaire.'
    }
  ],
  events: [
    {
      id: 'evt-welcome',
      title: 'Soiree accueil nouveaux membres',
      date: '2026-02-10',
      time: '19:00',
      place: 'Le 6MIC, Aix-en-Provence',
      type: 'Club',
      seats: 120
    },
    {
      id: 'evt-victoire-run',
      title: 'Sortie trail decouverte',
      date: '2026-02-21',
      time: '08:30',
      place: 'Saint-Antonin-sur-Bayon',
      type: 'Sport',
      seats: 35
    },
    {
      id: 'evt-carnaval',
      title: 'Parcours carnaval d Aix',
      date: '2026-03-07',
      time: '15:00',
      place: 'Cours Mirabeau',
      type: 'Ville',
      seats: 80
    },
    {
      id: 'evt-calanques-day',
      title: 'Journee mer et nature',
      date: '2026-03-14',
      time: '09:00',
      place: 'Cassis',
      type: 'Aventure',
      seats: 40
    },
    {
      id: 'evt-spring-fair',
      title: 'Salon associatif de printemps',
      date: '2026-04-04',
      time: '10:00',
      place: 'Place des Precheurs',
      type: 'Club',
      seats: 200
    },
    {
      id: 'evt-night-photo',
      title: 'Balade photo de nuit',
      date: '2026-04-17',
      time: '20:30',
      place: 'Centre ancien',
      type: 'Creatif',
      seats: 22
    }
  ],
  gallery: [
    {
      title: 'Panorama Sainte-Victoire',
      caption: 'Lever du soleil pendant la sortie du samedi.',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Montagne_Sainte-Victoire.jpg',
      imageAlt: 'Montagne Sainte-Victoire',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Montagne_Sainte-Victoire.jpg'
    },
    {
      title: 'Marche provencal',
      caption: 'Rencontre de producteurs locaux a Aix.',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Aix-en-Provence_(13)_Place_Richelme_940.jpg',
      imageAlt: 'Place Richelme',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Aix-en-Provence_(13)_Place_Richelme_940.jpg'
    },
    {
      title: 'Atelier photo',
      caption: 'Exercices de perspective dans le centre-ville.',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Fontaine_de_la_Rotonde_-_Aix-en-Provence.JPG',
      imageAlt: 'Fontaine de la Rotonde',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Fontaine_de_la_Rotonde_-_Aix-en-Provence.JPG'
    },
    {
      title: 'Sortie Calanques',
      caption: 'Journee nature et mer pres de Cassis.',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Calanque_d%27en_Vau.jpg',
      imageAlt: 'Calanque d en Vau',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Calanque_d%27en_Vau.jpg'
    }
  ],
  members: [
    { name: 'Paul LAMBLIN', role: 'President & Chef de dev', photo: 'assets/paul-lamblin.jpg', color: '#0071e3' },
    { name: 'Clement MARCO', role: 'Chef de dev adjoint', photo: 'assets/clement-marco.jpg', color: '#7c3aed' },
    { name: 'Membre 3', role: 'Tresorier', initials: 'M3', color: '#db2777' },
    { name: 'Membre 4', role: 'Secretaire', initials: 'M4', color: '#ea580c' },
    { name: 'Membre 5', role: 'Resp. sorties', initials: 'M5', color: '#059669' },
    { name: 'Membre 6', role: 'Communication', initials: 'M6', color: '#0891b2' },
    { name: 'Membre 7', role: 'Evenements', initials: 'M7', color: '#d97706' },
    { name: 'Membre 8', role: 'Membre actif', initials: 'M8', color: '#be123c' }
  ],
  testimonials: [
    {
      name: 'Lucie M.',
      role: 'Membre depuis 2024',
      quote: 'Le club m a permis de rencontrer du monde rapidement et de mieux connaitre la region.'
    },
    {
      name: 'Karim R.',
      role: 'Responsable sorties nature',
      quote: 'On construit chaque parcours avec un vrai encadrement pour que ce soit convivial et securise.'
    },
    {
      name: 'Jeanne P.',
      role: 'Nouvelle adherente',
      quote: 'Le calendrier est clair et l inscription aux activites est super simple.'
    }
  ]
};
