(function () {
  var data = window.clubData || { activities: [], events: [], gallery: [], testimonials: [] };

  // ===== Utilitaires =====
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function formatDate(dateStr) {
    var date = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
    }).format(date);
  }

  function euro(value) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  }

  function renderImage(item, className) {
    if (!item.image) return '';
    var alt = item.imageAlt || item.title || 'Image';
    return '<img class="' + className + '" src="' + item.image + '" alt="' + alt + '" loading="lazy">';
  }

  // ===== Navigation =====
  function initNavigation() {
    var path = window.location.pathname.split('/').pop() || 'main.html';
    qsa('.nav-link').forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === path);
    });

    var toggle = qs('[data-nav-toggle]');
    var nav = qs('[data-nav]');
    if (toggle && nav) {
      toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
      qsa('.nav-link', nav).forEach(function (link) {
        link.addEventListener('click', function () { nav.classList.remove('open'); });
      });
    }

    var year = qs('[data-year]');
    if (year) year.textContent = String(new Date().getFullYear());

    qsa('[data-club-logo]').forEach(function (logo) {
      var src = data.club && data.club.logo ? data.club.logo : 'assets/logo-bdp-esaip-aix.png';
      logo.setAttribute('src', src);
      logo.setAttribute('alt', (data.club && data.club.name ? data.club.name : 'Logo du club') + ' logo');
      logo.addEventListener('error', function () {
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="100%" height="100%" rx="14" fill="#08345e"/><text x="50%" y="56%" text-anchor="middle" fill="#00b7ff" font-size="28" font-family="Arial">CDD</text></svg>';
        logo.setAttribute('src', 'data:image/svg+xml;utf8,' + encodeURIComponent(svg));
      });
    });
  }

  // ===== Newsletter =====
  function initNewsletter() {
    var form = qs('#newsletter-form');
    var feedback = qs('#newsletter-feedback');
    if (!form || !feedback) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = String(new FormData(form).get('email') || '').trim();
      if (!email.includes('@') || email.length < 6) {
        feedback.className = 'notice error';
        feedback.style.display = '';
        feedback.textContent = 'Adresse e-mail invalide.';
        return;
      }
      var list = JSON.parse(localStorage.getItem('club:newsletter') || '[]');
      if (!list.includes(email)) list.push(email);
      localStorage.setItem('club:newsletter', JSON.stringify(list));
      feedback.className = 'notice success';
      feedback.style.display = '';
      feedback.textContent = 'Merci, vous etes inscrit a la newsletter du club.';
      form.reset();
    });
  }

  // ===== Modal d'inscription partage (calendrier + activites) =====
  var CLUB_EMAIL = 'clubdecouvertes.aix@esaip.org';
  var _modalItem = null;
  var _onModalClose = null; // callback apres fermeture (ex: refresh calendrier)

  function getInterests() {
    return JSON.parse(localStorage.getItem('club:interests') || '{}');
  }

  function getUserInterests() {
    return JSON.parse(localStorage.getItem('club:user-interests') || '[]');
  }

  function openModal(html) {
    var overlay = qs('#event-detail');
    if (!overlay) return;
    overlay.innerHTML = html;
    overlay.classList.add('open');
  }

  function closeModal() {
    var overlay = qs('#event-detail');
    if (overlay) overlay.classList.remove('open');
    if (_onModalClose) _onModalClose();
  }

  function showItemDetail(item) {
    _modalItem = item;
    var count = getInterests()[item.id] || 0;
    var isInterested = getUserInterests().indexOf(item.id) !== -1;
    var capacity = item.seats || item.slots || 0;
    var kind = item.kind || 'activity';

    openModal(
      '<div class="evt-detail-inner">' +
      '<div class="evt-detail-header">' +
      '<span class="chip cal-chip-' + kind + '">' + (item.type || item.category || '') + '</span>' +
      '<button class="evt-detail-close" id="close-detail" aria-label="Fermer">&times;</button>' +
      '</div>' +
      '<h3>' + item.title + '</h3>' +
      '<p class="muted">' + formatDate(item.date || item.nextDate) + (item.time ? ' \u00e0 ' + item.time : '') + '</p>' +
      '<p><strong>Lieu\u00a0:</strong> ' + (item.place || item.meetingPoint || '') + '</p>' +
      (item.description ? '<p class="muted">' + item.description + '</p>' : '') +
      (capacity ? '<p class="muted">Capacit\u00e9\u00a0: ' + capacity + ' places</p>' : '') +
      '<div class="interest-row">' +
      (isInterested
        ? '<button class="btn btn-interested-active" id="already-in">&#10003;\u00a0Je participe</button>' +
          '<button class="btn btn-secondary" id="cancel-interest">Annuler</button>'
        : '<button class="btn btn-primary" id="open-form">Je suis int\u00e9ress\u00e9(e)</button>') +
      '<span class="interest-count"><strong>' + count + '</strong>\u00a0participant' + (count !== 1 ? 's' : '') + '</span>' +
      '</div>' +
      '</div>'
    );
  }

  function showRegistrationForm() {
    var item = _modalItem;
    if (!item) return;
    openModal(
      '<div class="evt-detail-inner reg-form-inner">' +
      '<div class="evt-detail-header">' +
      '<span class="muted" style="font-size:0.82rem;font-weight:600">' + item.title + ' \u2014 ' + formatDate(item.date || item.nextDate) + '</span>' +
      '<button class="evt-detail-close" id="close-detail" aria-label="Fermer">&times;</button>' +
      '</div>' +
      '<h3>S\u2019inscrire \u00e0 cette sortie</h3>' +
      '<form id="reg-form">' +
      '<div class="reg-row">' +
      '<div class="field-group"><label for="reg-prenom">Pr\u00e9nom *</label><input id="reg-prenom" name="prenom" type="text" required placeholder="Emma"></div>' +
      '<div class="field-group"><label for="reg-nom">Nom *</label><input id="reg-nom" name="nom" type="text" required placeholder="Dupont"></div>' +
      '</div>' +
      '<div class="field-group"><label for="reg-email">Email *</label><input id="reg-email" name="email" type="email" required placeholder="emma.dupont@email.com"></div>' +
      '<div class="field-group"><label for="reg-tel">T\u00e9l\u00e9phone</label><input id="reg-tel" name="tel" type="tel" placeholder="+33 6 ..."></div>' +
      '<div class="field-group"><label for="reg-message">Question ou commentaire</label><textarea id="reg-message" name="message" rows="2" placeholder="Optionnel..."></textarea></div>' +
      '<p id="reg-feedback" class="notice error" style="display:none"></p>' +
      '<div class="reg-actions">' +
      '<button type="button" class="btn btn-secondary" id="back-to-detail">Retour</button>' +
      '<button type="submit" class="btn btn-primary" id="reg-submit">Confirmer l\u2019inscription</button>' +
      '</div>' +
      '</form>' +
      '</div>'
    );
  }

  function showSuccessStep(prenom, method) {
    var item = _modalItem;
    var msg = method === 'web3forms'
      ? 'Votre inscription a \u00e9t\u00e9 envoy\u00e9e directement au club\u00a0!'
      : 'Votre messagerie s\u2019est ouverte avec un e-mail pr\u00e9-rempli \u00e0 envoyer.';
    openModal(
      '<div class="evt-detail-inner">' +
      '<div class="success-icon">&#10003;</div>' +
      '<h3>Merci ' + prenom + '\u00a0!</h3>' +
      '<p>' + msg + '</p>' +
      (method !== 'web3forms' ? '<p class="muted">Si rien ne s\u2019est ouvert, \u00e9crivez \u00e0 <a href="mailto:' + CLUB_EMAIL + '">' + CLUB_EMAIL + '</a></p>' : '') +
      '<p class="muted">Activit\u00e9\u00a0: <strong>' + item.title + '</strong> \u2014 ' + formatDate(item.date || item.nextDate) + '</p>' +
      '<button class="btn btn-primary" id="close-success">Fermer</button>' +
      '</div>'
    );
  }

  function handleRegistrationSubmit(form) {
    var fd = new FormData(form);
    var prenom = (fd.get('prenom') || '').trim();
    var nom = (fd.get('nom') || '').trim();
    var email = (fd.get('email') || '').trim();
    var tel = (fd.get('tel') || '').trim();
    var message = (fd.get('message') || '').trim();

    var feedback = qs('#reg-feedback');
    if (!prenom || !nom || !email) {
      if (feedback) { feedback.style.display = ''; feedback.textContent = 'Merci de remplir les champs obligatoires (*).'; }
      return;
    }

    var item = _modalItem;
    var id = item.id;

    // Sauvegarder localement
    var regs = JSON.parse(localStorage.getItem('club:registrations') || '[]');
    regs.push({ id: id, title: item.title, date: item.date || item.nextDate, prenom: prenom, nom: nom, email: email, tel: tel, message: message, createdAt: new Date().toISOString() });
    localStorage.setItem('club:registrations', JSON.stringify(regs));

    // Mettre a jour le compteur
    var ints = getInterests();
    var uInts = getUserInterests();
    if (uInts.indexOf(id) === -1) {
      uInts.push(id);
      ints[id] = (ints[id] || 0) + 1;
      localStorage.setItem('club:user-interests', JSON.stringify(uInts));
      localStorage.setItem('club:interests', JSON.stringify(ints));
    }

    var submitBtn = qs('#reg-submit');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Envoi en cours...'; }

    var dateLabel = formatDate(item.date || item.nextDate);
    var lieu = item.place || item.meetingPoint || '';
    var emailLines = [
      'Bonjour,\r\n',
      prenom + ' ' + nom + ' souhaite participer \u00e0 :\r\n',
      'Activit\u00e9 : ' + item.title,
      'Date : ' + dateLabel + (item.time ? ' \u00e0 ' + item.time : ''),
      'Lieu : ' + lieu,
      '\r\nCoordonn\u00e9es :',
      'Pr\u00e9nom : ' + prenom,
      'Nom : ' + nom,
      'Email : ' + email
    ];
    if (tel) emailLines.push('T\u00e9l\u00e9phone : ' + tel);
    if (message) emailLines.push('Message : ' + message);
    emailLines.push('\r\n---\r\nInscription via le site du Club de D\u00e9couverte');

    var web3Key = data.club && data.club.web3formsKey;
    if (web3Key && web3Key !== 'VOTRE_CLE_WEB3FORMS') {
      // Envoi automatique via Web3Forms (aucune boite mail ne s'ouvre)
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3Key,
          subject: 'Inscription - ' + item.title + ' - ' + dateLabel,
          from_name: prenom + ' ' + nom,
          replyto: email,
          message: emailLines.join('\r\n')
        })
      })
        .then(function (r) { return r.json(); })
        .then(function (result) {
          if (result.success) {
            showSuccessStep(prenom, 'web3forms');
          } else {
            if (feedback) { feedback.style.display = ''; feedback.textContent = 'Erreur d\'envoi. Contactez-nous \u00e0 ' + CLUB_EMAIL; }
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'R\u00e9essayer'; }
          }
        })
        .catch(function () {
          if (feedback) { feedback.style.display = ''; feedback.textContent = 'Erreur r\u00e9seau. Contactez-nous \u00e0 ' + CLUB_EMAIL; }
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'R\u00e9essayer'; }
        });
    } else {
      // Fallback mailto (si pas de cle Web3Forms configuree)
      var subject = encodeURIComponent('Inscription - ' + item.title + ' - ' + dateLabel);
      var body = encodeURIComponent(emailLines.join('\r\n'));
      var a = document.createElement('a');
      a.href = 'mailto:' + CLUB_EMAIL + '?subject=' + subject + '&body=' + body;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showSuccessStep(prenom, 'mailto');
    }
  }

  function initModal() {
    var overlay = qs('#event-detail');
    if (!overlay) return;

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { closeModal(); return; }
      if (e.target.closest('#close-detail') || e.target.closest('#close-success')) { closeModal(); return; }
      if (e.target.closest('#open-form')) { showRegistrationForm(); return; }
      if (e.target.closest('#back-to-detail') && _modalItem) { showItemDetail(_modalItem); return; }
      if (e.target.closest('#cancel-interest') && _modalItem) {
        var ints = getInterests();
        var uInts = getUserInterests();
        var idx = uInts.indexOf(_modalItem.id);
        if (idx !== -1) {
          uInts.splice(idx, 1);
          ints[_modalItem.id] = Math.max(0, (ints[_modalItem.id] || 1) - 1);
          localStorage.setItem('club:user-interests', JSON.stringify(uInts));
          localStorage.setItem('club:interests', JSON.stringify(ints));
        }
        showItemDetail(_modalItem);
        return;
      }
    });

    overlay.addEventListener('submit', function (e) {
      if (!e.target || e.target.id !== 'reg-form') return;
      e.preventDefault();
      handleRegistrationSubmit(e.target);
    });
  }

  // ===== Activites =====
  function renderActivities(activities) {
    var container = qs('#activities-results');
    if (!container) return;

    if (!activities.length) {
      container.innerHTML = '<p class="notice">Aucune activite ne correspond a vos filtres.</p>';
      return;
    }

    var interests = getInterests();
    var userInts = getUserInterests();

    container.innerHTML = activities.map(function (item) {
      var isInterested = userInts.indexOf(item.id) !== -1;
      var count = interests[item.id] || 0;
      return (
        '<article class="card reveal">' +
        renderImage(item, 'card-image') +
        '<div class="stack">' +
        '<span class="chip">' + item.category + '</span>' +
        '<h3>' + item.title + '</h3>' +
        '<p class="muted">' + item.description + '</p>' +
        '</div>' +
        '<div class="stack">' +
        '<p><strong>Prochaine date:</strong> ' + formatDate(item.nextDate) + '</p>' +
        '<p><strong>Niveau:</strong> ' + item.level + '</p>' +
        '<p><strong>Duree:</strong> ' + item.duration + '</p>' +
        '<p><strong>Rendez-vous:</strong> ' + item.meetingPoint + '</p>' +
        '<p><strong>Tarif membre:</strong> ' + euro(item.priceMember) + '</p>' +
        (item.imageCreditUrl ? '<p class="muted">Source: <a href="' + item.imageCreditUrl + '" target="_blank" rel="noreferrer">' + item.imageCredit + '</a></p>' : '') +
        '</div>' +
        '<div class="interest-row">' +
        '<button class="btn ' + (isInterested ? 'btn-interested-active' : 'btn-primary') + '" data-open-activity="' + item.id + '">' +
        (isInterested ? '&#10003;\u00a0Je participe' : 'Je suis int\u00e9ress\u00e9(e)') +
        '</button>' +
        '<span class="interest-count"><strong>' + count + '</strong>\u00a0participant' + (count !== 1 ? 's' : '') + '</span>' +
        '</div>' +
        '</article>'
      );
    }).join('');
  }

  function initActivitiesPage() {
    var results = qs('#activities-results');
    if (!results) return;

    var search = qs('#activity-search');
    var category = qs('#activity-category');
    var level = qs('#activity-level');
    var priceMax = qs('#price-max');
    var priceLabel = qs('#price-max-label');
    var durationFilter = qs('#duration-filter');

    var categories = ['Toutes'].concat(Array.from(new Set(data.activities.map(function (a) { return a.category; }))));
    var levels = ['Tous'].concat(Array.from(new Set(data.activities.map(function (a) { return a.level; }))));

    category.innerHTML = categories.map(function (v) { return '<option value="' + v + '">' + v + '</option>'; }).join('');
    level.innerHTML = levels.map(function (v) { return '<option value="' + v + '">' + v + '</option>'; }).join('');

    if (priceMax && priceLabel) {
      priceMax.addEventListener('input', function () {
        priceLabel.textContent = priceMax.value === '15' ? '15 € (tous)' : priceMax.value + ' €';
        applyFilters();
      });
    }

    // Delegation unique sur le conteneur (survit aux re-rendus)
    results.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-open-activity]');
      if (!btn) return;
      var id = btn.getAttribute('data-open-activity');
      var activity = data.activities.find(function (a) { return a.id === id; });
      if (activity) {
        _onModalClose = function () { renderActivities(getCurrentFiltered()); };
        showItemDetail(Object.assign({}, activity, { kind: 'activity', date: activity.nextDate, place: activity.meetingPoint }));
      }
    });

    var currentFiltered = data.activities;
    function getCurrentFiltered() { return currentFiltered; }

    function parseDurationHours(str) {
      if (!str) return 99;
      var s = String(str).toLowerCase();
      if (s.indexOf('journee') !== -1) return 8;
      var m = s.match(/(\d+(?:[.,]\d+)?)\s*h/);
      if (m) return parseFloat(m[1].replace(',', '.'));
      return 99;
    }

    function applyFilters() {
      var q = (search.value || '').trim().toLowerCase();
      var c = category.value;
      var l = level.value;
      var maxPrice = priceMax ? parseInt(priceMax.value, 10) : 15;
      var maxDuration = durationFilter && durationFilter.value ? parseInt(durationFilter.value, 10) : 99;

      currentFiltered = data.activities.filter(function (item) {
        var text = (item.title + ' ' + item.description + ' ' + item.meetingPoint).toLowerCase();
        var matchText = !q || text.includes(q);
        var matchCat = c === 'Toutes' || item.category === c;
        var matchLvl = l === 'Tous' || item.level === l;
        var matchPrice = (item.priceMember || 0) <= maxPrice;
        var matchDuration = parseDurationHours(item.duration) <= maxDuration;
        return matchText && matchCat && matchLvl && matchPrice && matchDuration;
      });
      renderActivities(currentFiltered);
      initReveal();
    }

    [search, category, level].forEach(function (el) {
      el.addEventListener('input', applyFilters);
      el.addEventListener('change', applyFilters);
    });
    if (durationFilter) {
      durationFilter.addEventListener('change', applyFilters);
    }

    renderActivities(data.activities);
    initReveal();
  }

  // ===== Calendrier =====
  function initCalendarPage() {
    var calendarEl = qs('#calendar-grid');
    if (!calendarEl) return;

    var monthLabel = qs('#cal-month-label');
    var prevBtn = qs('#cal-prev');
    var nextBtn = qs('#cal-next');

    var allItems = data.events.map(function (e) {
      return Object.assign({}, e, { kind: 'event' });
    }).concat(data.activities.map(function (a) {
      return Object.assign({}, a, { kind: 'activity', date: a.nextDate, place: a.meetingPoint });
    }));

    var now = new Date();
    var currentYear = now.getFullYear();
    var currentMonth = now.getMonth();

    function getItemsForDate(dateStr) {
      return allItems.filter(function (item) { return item.date === dateStr; });
    }

    function renderCalendar() {
      var year = currentYear;
      var month = currentMonth;
      var label = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));
      monthLabel.textContent = label.charAt(0).toUpperCase() + label.slice(1);

      var firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
      var daysInMonth = new Date(year, month + 1, 0).getDate();
      var today = new Date();
      var interests = getInterests();

      var html = '<div class="cal-grid">';
      ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].forEach(function (d) {
        html += '<div class="cal-day-header">' + d + '</div>';
      });
      for (var i = 0; i < firstDow; i++) {
        html += '<div class="cal-cell cal-empty"></div>';
      }
      for (var day = 1; day <= daysInMonth; day++) {
        var dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        var dayItems = getItemsForDate(dateStr);
        var isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
        html += '<div class="cal-cell' + (isToday ? ' cal-today' : '') + '">';
        html += '<span class="cal-day-num">' + day + '</span>';
        if (dayItems.length) {
          html += '<div class="cal-events">';
          dayItems.forEach(function (item) {
            var count = interests[item.id] || 0;
            html += '<button class="cal-evt-chip" data-event-id="' + item.id + '" data-kind="' + item.kind + '">' +
              '<span class="cal-evt-title">' + item.title + '</span>' +
              (count > 0 ? '<span class="cal-evt-badge">' + count + '</span>' : '') +
              '</button>';
          });
          html += '</div>';
        }
        html += '</div>';
      }
      html += '</div>' +
        '<div class="cal-legend">' +
        '<span class="cal-legend-item"><span class="cal-legend-dot cal-dot-event"></span>Evenement</span>' +
        '<span class="cal-legend-item"><span class="cal-legend-dot cal-dot-activity"></span>Sortie / Activite</span>' +
        '</div>';
      calendarEl.innerHTML = html;
    }

    // Callback pour rafraichir le calendrier apres inscription
    _onModalClose = renderCalendar;

    // Listener unique sur le calendrier
    calendarEl.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-event-id]');
      if (!chip) return;
      var id = chip.getAttribute('data-event-id');
      var kind = chip.getAttribute('data-kind');
      var item = kind === 'event'
        ? data.events.find(function (ev) { return ev.id === id; })
        : data.activities.find(function (a) { return a.id === id; });
      if (item) {
        _onModalClose = renderCalendar;
        showItemDetail(Object.assign({}, item, { kind: kind, date: item.date || item.nextDate, place: item.place || item.meetingPoint }));
      }
    });

    prevBtn.addEventListener('click', function () {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      renderCalendar();
    });

    nextBtn.addEventListener('click', function () {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      renderCalendar();
    });

    renderCalendar();

    var upcoming = qs('#upcoming-count');
    if (upcoming) {
      var future = new Date();
      upcoming.textContent = String(data.events.filter(function (e) {
        return new Date(e.date + 'T00:00:00') >= future;
      }).length);
    }
  }

  // ===== Adhesion =====
  function initMembershipPage() {
    var form = qs('#membership-form');
    if (!form) return;

    var fee = qs('#membership-fee');
    var feedback = qs('#membership-feedback');
    var typeSelect = qs('#member-type');

    function updateFee() {
      var type = typeSelect.value;
      var amount = type === 'Etudiant' ? 20 : type === 'Jeune actif' ? 30 : 25;
      fee.textContent = euro(amount);
    }

    typeSelect.addEventListener('change', updateFee);
    updateFee();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var payload = Object.fromEntries(fd.entries());
      if (!payload.fullName || !payload.email || !payload.memberType) {
        feedback.className = 'notice error';
        feedback.textContent = 'Merci de remplir les champs obligatoires.';
        return;
      }
      var members = JSON.parse(localStorage.getItem('club:members') || '[]');
      members.push(Object.assign({ createdAt: new Date().toISOString() }, payload));
      localStorage.setItem('club:members', JSON.stringify(members));
      feedback.className = 'notice success';
      feedback.textContent = 'Demande envoyee. Vous recevrez une confirmation par e-mail sous 48h.';
      form.reset();
      updateFee();
    });
  }

  // ===== Contact =====
  function initContactPage() {
    var form = qs('#contact-form');
    if (!form) return;

    var feedback = qs('#contact-feedback');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var payload = Object.fromEntries(fd.entries());
      if (!payload.name || !payload.email || !payload.message) {
        feedback.className = 'notice error';
        feedback.style.display = '';
        feedback.textContent = 'Nom, e-mail et message sont requis.';
        return;
      }

      var messages = JSON.parse(localStorage.getItem('club:messages') || '[]');
      messages.push(Object.assign({ createdAt: new Date().toISOString() }, payload));
      localStorage.setItem('club:messages', JSON.stringify(messages));

      var web3Key = data.club && data.club.web3formsKey;
      var submitBtn = qs('[type="submit"]', form);

      if (web3Key && web3Key !== 'VOTRE_CLE_WEB3FORMS') {
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Envoi...'; }
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: web3Key,
            subject: (payload.subject || 'Message depuis le site') + ' - ' + payload.name,
            from_name: payload.name,
            replyto: payload.email,
            message: payload.message
          })
        })
          .then(function (r) { return r.json(); })
          .then(function (result) {
            if (result.success) {
              feedback.className = 'notice success';
              feedback.style.display = '';
              feedback.textContent = 'Message envoy\u00e9\u00a0! L\'\u00e9quipe vous r\u00e9pond rapidement.';
              form.reset();
            } else {
              feedback.className = 'notice error';
              feedback.style.display = '';
              feedback.textContent = 'Erreur d\'envoi. Contactez-nous \u00e0 ' + CLUB_EMAIL;
              if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Envoyer'; }
            }
          })
          .catch(function () {
            feedback.className = 'notice error';
            feedback.style.display = '';
            feedback.textContent = 'Erreur r\u00e9seau. Contactez-nous \u00e0 ' + CLUB_EMAIL;
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Envoyer'; }
          });
      } else {
        // Fallback mailto
        var subject = encodeURIComponent((payload.subject || 'Message depuis le site') + ' - ' + payload.name);
        var body = encodeURIComponent(
          'Bonjour,\r\n\r\n' + payload.name + ' vous contacte via le site du club.\r\n\r\n' +
          'Message :\r\n' + payload.message + '\r\n\r\nR\u00e9pondre \u00e0 : ' + payload.email + '\r\n' +
          '---\r\nEnvoy\u00e9 depuis le site du Club de D\u00e9couverte'
        );
        var a = document.createElement('a');
        a.href = 'mailto:' + CLUB_EMAIL + '?subject=' + subject + '&body=' + body;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        feedback.className = 'notice success';
        feedback.style.display = '';
        feedback.textContent = 'Votre messagerie s\'est ouverte avec le message. Envoyez-le pour contacter l\'\u00e9quipe.';
        form.reset();
      }
    });
  }

  // ===== Accueil =====
  function initHomePage() {
    var stats = qs('#home-stats');
    if (!stats) return;

    var items = [
      { value: data.activities.length, label: 'activites programmees' },
      { value: data.events.length, label: 'evenements saison 2026' },
      { value: 8, label: 'membres actifs' },
      { value: 3, label: 'benevoles organisateurs' }
    ];
    stats.innerHTML = items.map(function (item) {
      return '<article class="kpi reveal"><strong>' + item.value + '</strong><span>' + item.label + '</span></article>';
    }).join('');

    var previews = qs('#home-previews');
    if (previews) {
      previews.innerHTML = data.activities.slice(0, 3).map(function (item) {
        return (
          '<article class="card reveal">' +
          renderImage(item, 'card-image') +
          '<span class="chip">' + item.category + '</span>' +
          '<h3>' + item.title + '</h3>' +
          '<p class="muted">' + formatDate(item.nextDate) + ' - ' + item.meetingPoint + '</p>' +
          '<p>' + item.description + '</p>' +
          '</article>'
        );
      }).join('');
    }

    var events = qs('#home-events');
    if (events) {
      var next = data.events.slice().sort(function (a, b) { return a.date.localeCompare(b.date); }).slice(0, 4);
      events.innerHTML = next.map(function (event) {
        return (
          '<li>' +
          '<div><strong>' + event.title + '</strong><br><span class="muted">' + formatDate(event.date) + ' a ' + event.time + ' - ' + event.place + '</span></div>' +
          '<span class="chip">' + event.type + '</span>' +
          '</li>'
        );
      }).join('');
    }
  }

  // ===== Galerie =====
  function initGalleryPage() {
    var gallery = qs('#gallery-list');
    var testimonials = qs('#testimonials-list');
    if (!gallery || !testimonials) return;

    gallery.innerHTML = data.gallery.map(function (item) {
      return (
        '<article class="gallery-card reveal">' +
        renderImage(item, 'gallery-image') +
        '<div class="copy">' +
        '<h3>' + item.title + '</h3>' +
        '<p class="muted">' + item.caption + '</p>' +
        (item.creditUrl ? '<p><a class="muted" href="' + item.creditUrl + '" target="_blank" rel="noreferrer">Source image</a></p>' : '') +
        '</div>' +
        '</article>'
      );
    }).join('');

    testimonials.innerHTML = data.testimonials.map(function (item) {
      return (
        '<article class="card reveal">' +
        '<p class="quote">"' + item.quote + '"</p>' +
        '<p class="quote-author">' + item.name + ' - ' + item.role + '</p>' +
        '</article>'
      );
    }).join('');
  }

  // ===== Scroll reveal (IntersectionObserver) =====
  function initReveal() {
    var els = qsa('.reveal:not(.visible)');
    if (!els.length || !('IntersectionObserver' in window)) {
      qsa('.reveal').forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  // ===== Bouton haut de page =====
  function initBackToTop() {
    var button = document.createElement('button');
    button.className = 'to-top';
    button.type = 'button';
    button.textContent = 'Haut';
    document.body.appendChild(button);
    window.addEventListener('scroll', function () {
      button.classList.toggle('show', window.scrollY > 280);
    });
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== Initialisation =====
  document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initNewsletter();
    initModal();
    initHomePage();
    initActivitiesPage();
    initCalendarPage();
    initMembershipPage();
    initGalleryPage();
    initContactPage();
    initBackToTop();
    initReveal();
  });
})();
