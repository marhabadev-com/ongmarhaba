/* ONG Marhaba · interactions du site
   Les contenus modifiables (chiffres, galerie, actualités, partenaires, contact)
   sont lus dans le dossier data/ : ils se modifient depuis l'espace admin (/admin/). */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  /* ---------- Outils ---------- */
  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  /* Les chemins enregistrés par l'admin commencent par « / » : on les rend relatifs
     pour que le site fonctionne aussi dans un sous-dossier (GitHub Pages). */
  function src(p) {
    if (!p) return "";
    if (/^(https?:)?\/\//.test(p) || p.indexOf("data:") === 0) return p;
    return p.replace(/^\/(ongmarhabane\/)?/, "");
  }
  function getJSON(name) {
    return fetch("data/" + name + ".json", { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(name);
      return r.json();
    });
  }
  function fmtDate(d) {
    if (!d) return "";
    var t = new Date(d);
    if (isNaN(t)) return esc(d);
    return t.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  }

  /* ---------- En-tête au défilement ---------- */
  var header = document.querySelector(".header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 40); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById("burger");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  }
  burger.addEventListener("click", function () { setMenu(!document.body.classList.contains("menu-open")); });
  document.querySelectorAll(".nav a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---------- Lien actif dans le menu ---------- */
  var links = {};
  document.querySelectorAll(".nav ul a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && links[en.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove("is-current"); });
          links[en.target.id].classList.add("is-current");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Diaporama du héro ---------- */
  var slides = document.querySelectorAll(".hero__slide");
  var dots = document.querySelectorAll(".hero__dots button");
  var cur = 0, timer;
  function show(i) {
    slides[cur].classList.remove("is-active"); dots[cur].classList.remove("is-active");
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add("is-active"); dots[cur].classList.add("is-active");
  }
  function play() { clearInterval(timer); timer = setInterval(function () { show(cur + 1); }, 6000); }
  dots.forEach(function (d, i) { d.addEventListener("click", function () { show(i); play(); }); });
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) play();

  /* ---------- Compteurs et apparition au défilement ---------- */
  function countUp(el) {
    var target = +el.dataset.count, start = null, dur = 1600;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("fr-FR");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-visible");
      if (en.target.dataset.count) countUp(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 }) : null;
  function watch(root) {
    (root || document).querySelectorAll(".reveal, [data-count]").forEach(function (el) {
      if (io) io.observe(el);
      else { el.classList.add("is-visible"); if (el.dataset.count) el.textContent = el.dataset.count; }
    });
  }
  watch();

  /* ---------- Chiffres clés ---------- */
  getJSON("chiffres").then(function (d) {
    var g = document.getElementById("statsGrid");
    g.innerHTML = (d.chiffres || []).map(function (c) {
      return '<div class="stat"><span class="stat__num" data-count="' + (+c.nombre || 0) + '">0</span>' +
        '<span class="stat__label">' + esc(c.libelle) + "</span></div>";
    }).join("");
    document.getElementById("statsSrc").textContent = d.source || "";
    watch(g);
  }).catch(function () {});

  /* ---------- Partenaires ---------- */
  getJSON("partenaires").then(function (d) {
    var g = document.getElementById("partnersGrid");
    g.innerHTML = (d.partenaires || []).map(function (p) {
      var logo = p.logo
        ? '<span class="partner__logo"><img src="' + esc(src(p.logo)) + '" alt="Logo ' + esc(p.nom) + '" loading="lazy"></span>'
        : '<span class="partner__mark">' + esc(p.nom) + "</span>";
      var inner = logo + '<span class="partner__name">' + esc(p.nom) + '</span><span class="partner__desc">' + esc(p.description) + "</span>";
      return p.lien
        ? '<a class="partner reveal" href="' + esc(p.lien) + '" target="_blank" rel="noopener">' + inner + "</a>"
        : '<div class="partner reveal">' + inner + "</div>";
    }).join("");
    watch(g);
  }).catch(function () {});

  /* ---------- Actualités et publications ---------- */
  getJSON("actualites").then(function (d) {
    var items = (d.actualites || []).slice().sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
    var g = document.getElementById("newsGrid");
    if (!items.length) { g.innerHTML = '<p class="news__empty">Aucune actualité pour le moment.</p>'; return; }
    g.innerHTML = items.map(function (n) {
      var href = n.fichier ? src(n.fichier) : (n.lien || "");
      var tag = href ? "a" : "article";
      var attrs = href ? ' href="' + esc(href) + '" target="_blank" rel="noopener"' : "";
      var meta = [n.type, fmtDate(n.date)].filter(Boolean).join(" · ");
      var action = n.fichier ? "Télécharger" : (n.lien ? "Lire la suite" : "");
      return "<" + tag + ' class="news-card reveal"' + attrs + ">" +
        (n.image ? '<div class="news-card__img"><img src="' + esc(src(n.image)) + '" alt="" loading="lazy"></div>' : "") +
        '<div class="news-card__body"><span class="news-card__type">' + esc(meta) + "</span>" +
        "<h3>" + esc(n.titre) + "</h3>" + (n.resume ? "<p>" + esc(n.resume) + "</p>" : "") +
        (action ? '<span class="link-arrow">' + action + "</span>" : "") + "</div></" + tag + ">";
    }).join("");
    watch(g);
  }).catch(function () {});

  /* ---------- Contact ---------- */
  var EMAILS = ["ongmarh@yahoo.com"];
  getJSON("contact").then(function (d) {
    EMAILS = (d.emails && d.emails.length) ? d.emails : EMAILS;
    var ic = {
      mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
      tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
      pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>'
    };
    var tel = d.telephone ? d.telephone.replace(/[^\d+]/g, "") : "";
    var mails = EMAILS.map(function (m) { return '<a href="mailto:' + esc(m) + '">' + esc(m) + "</a>"; });
    var html = '<li>' + ic.mail + "<div><span>E-mail</span>" + mails.join("<br>") + "</div></li>";
    if (d.telephone) html += "<li>" + ic.tel + '<div><span>Téléphone</span><a href="tel:' + esc(tel) + '">' + esc(d.telephone) + "</a></div></li>";
    if (d.adresse) html += "<li>" + ic.pin + "<div><span>Adresse</span><b>" + esc(d.adresse) + "</b></div></li>";
    document.getElementById("contactList").innerHTML = html;
    document.getElementById("footerContact").innerHTML =
      mails.map(function (m) { return "<li>" + m + "</li>"; }).join("") +
      (d.telephone ? '<li><a href="tel:' + esc(tel) + '">' + esc(d.telephone) + "</a></li>" : "") +
      (d.adresse ? "<li>" + esc(d.adresse) + "</li>" : "");
  }).catch(function () {});

  /* ---------- Galerie ---------- */
  var PHOTOS = [], MIXED = [];
  var grid = document.getElementById("masonry");
  var moreBtn = document.getElementById("moreBtn");
  var filter = "all", limit = 12, visible = [];

  function render() {
    var list = filter === "all" ? MIXED : PHOTOS.filter(function (p) { return p.categorie === filter; });
    visible = list.slice(0, limit);
    grid.innerHTML = visible.map(function (p, i) {
      return '<figure tabindex="0" data-i="' + i + '"><img src="' + esc(src(p.vignette || p.image)) + '" alt="' + esc(p.legende) +
        '" loading="lazy"><figcaption>' + esc(p.legende) + "</figcaption></figure>";
    }).join("");
    moreBtn.hidden = list.length <= limit;
  }
  getJSON("galerie").then(function (d) {
    PHOTOS = d.photos || [];
    /* Vue « Tout » : on alterne les catégories pour varier les images */
    var groups = {}, order = [];
    PHOTOS.forEach(function (p) { if (!groups[p.categorie]) { groups[p.categorie] = []; order.push(p.categorie); } groups[p.categorie].push(p); });
    MIXED = [];
    for (var i = 0; MIXED.length < PHOTOS.length; i++) order.forEach(function (k) { if (groups[k][i]) MIXED.push(groups[k][i]); });
    render();
  }).catch(function () {});
  document.querySelectorAll(".filters button").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".filters button").forEach(function (x) { x.classList.remove("is-active"); });
      b.classList.add("is-active"); filter = b.dataset.filter; limit = 12; render();
    });
  });
  moreBtn.addEventListener("click", function () { limit += 12; render(); });

  /* ---------- Visionneuse ---------- */
  var lb = document.getElementById("lightbox"), lbImg = document.getElementById("lbImg"), lbCap = document.getElementById("lbCap");
  var idx = 0, lastFocus;
  function openLb(i) {
    idx = (i + visible.length) % visible.length;
    var p = visible[idx];
    lbImg.src = src(p.image); lbImg.alt = p.legende || "";
    lbCap.textContent = (p.legende || "") + "  ·  " + (idx + 1) + " / " + visible.length;
    if (lb.hidden) { lastFocus = document.activeElement; lb.hidden = false; document.body.style.overflow = "hidden"; lb.querySelector(".lightbox__close").focus(); }
  }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
  grid.addEventListener("click", function (e) { var f = e.target.closest("figure"); if (f) openLb(+f.dataset.i); });
  grid.addEventListener("keydown", function (e) { var f = e.target.closest("figure"); if (f && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openLb(+f.dataset.i); } });
  lb.querySelector(".lightbox__close").addEventListener("click", closeLb);
  lb.querySelector(".lightbox__prev").addEventListener("click", function () { openLb(idx - 1); });
  lb.querySelector(".lightbox__next").addEventListener("click", function () { openLb(idx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") openLb(idx - 1);
    if (e.key === "ArrowRight") openLb(idx + 1);
  });

  /* ---------- Formulaire (mailto, site statique) ---------- */
  var form = document.getElementById("contactForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (f) {
      var bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle("is-invalid", bad); if (bad) ok = false;
    });
    var note = document.getElementById("formNote");
    if (!ok) { note.textContent = "Merci de remplir correctement les champs obligatoires."; return; }
    var d = new FormData(form);
    var body = d.get("message") + "\n\n" + d.get("nom") + " (" + d.get("email") + ")";
    var cc = EMAILS.slice(1).join(",");
    window.location.href = "mailto:" + EMAILS[0] + "?" + (cc ? "cc=" + encodeURIComponent(cc) + "&" : "") +
      "subject=" + encodeURIComponent("[Site web] " + d.get("objet")) + "&body=" + encodeURIComponent(body);
    note.textContent = "Merci ! Votre messagerie s’ouvre pour envoyer le message.";
  });

  var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Application installable (PWA) ---------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
  var installBtn = document.getElementById("installBtn"), deferred = null;
  var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; installBtn.hidden = false; });
  if (isIOS && !standalone) installBtn.hidden = false;
  installBtn.addEventListener("click", function () {
    if (deferred) {
      deferred.prompt();
      deferred.userChoice.finally(function () { deferred = null; installBtn.hidden = true; });
    } else {
      document.getElementById("iosHelp").hidden = false;
    }
  });
  window.addEventListener("appinstalled", function () { installBtn.hidden = true; });
  var iosClose = document.querySelector("#iosHelp button");
  if (iosClose) iosClose.addEventListener("click", function () { document.getElementById("iosHelp").hidden = true; });
})();
