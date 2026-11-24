/* ONG Marhaba · interactions du site */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

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
          Object.values(links).forEach(function (l) { l.classList.remove("is-current"); });
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

  /* ---------- Compteurs animés ---------- */
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

  /* ---------- Apparition au défilement ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-visible");
        if (en.target.dataset.count) countUp(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal, [data-count]").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
    document.querySelectorAll("[data-count]").forEach(function (el) { el.textContent = el.dataset.count; });
  }

  /* ---------- Galerie ---------- */
  var PHOTOS = [
    ["wa0138", "agri", "Démonstration pratique au champ avec les producteurs et productrices"],
    ["wa0140", "agri", "Parcelle de mil en pleine croissance"],
    ["wa0137", "agri", "Préparation de traitements naturels lors d’une formation au champ"],
    ["wa0139", "agri", "Animation d’une séance de formation en plein champ"],
    ["wa0141", "agri", "Productrices et producteurs lors d’une démonstration"],
    ["wa0142", "agri", "Visite d’une parcelle de démonstration"],
    ["wa0143", "agri", "Échanges entre participants pendant la formation au champ"],
    ["wa0144", "agri", "Jeune producteur présentant les intrants préparés"],
    ["wa0145", "agri", "Restitution d’une séance pratique sur le terrain"],
    ["wa0146", "dotation", "Remise d’un kit d’équipement à une structure communautaire"],
    ["wa0147", "dotation", "Remise de matériel informatique au comité sous-régional de Matamey"],
    ["wa0150", "dotation", "Membres d’une commission foncière avec leur kit d’équipement"],
    ["wa0165", "dotation", "Commission foncière de base de Dogo et son kit d’équipement"],
    ["wa0148", "formation", "Atelier de formation en salle avec les membres des structures locales"],
    ["wa0154", "formation", "Sensibilisation sur la nutrition des enfants et des femmes, SCAP/RU de Dogo"],
    ["wa0151", "formation", "Séance de sensibilisation communautaire à l’aide de supports illustrés"],
    ["wa0155", "formation", "Échanges autour des boîtes à images de sensibilisation"],
    ["wa0153", "formation", "Participation des femmes à une séance de sensibilisation"],
    ["wa0156", "formation", "Séance de sensibilisation sous un hangar communautaire"],
    ["wa0157", "formation", "Animation d’une causerie éducative"],
    ["wa0158", "formation", "Causerie éducative avec les membres de la communauté"],
    ["wa0152", "formation", "Réunion d’échange avec les membres d’une structure communautaire"],
    ["wa0159", "formation", "Photo de groupe à l’issue d’une session de formation"],
    ["wa0160", "formation", "Restitution des travaux de groupe"],
    ["wa0161", "formation", "Visite de terrain dans un établissement communautaire"],
    ["wa0162", "formation", "Assemblée villageoise sous l’arbre à palabre"],
    ["wa0163", "formation", "Rencontre avec les communautés sur le terrain"],
    ["wa0164", "formation", "Réunion communautaire en plein air"],
    ["wa0176", "appui", "Distribution de vivres aux ménages vulnérables"],
    ["wa0172", "appui", "Ménages bénéficiaires réunis pour la distribution"],
    ["wa0173", "appui", "Remise d’un lot de vivres à une bénéficiaire"],
    ["wa0174", "appui", "Bénéficiaire avec son lot de vivres"],
    ["wa0175", "appui", "Organisation de la distribution sur le site"],
    ["wa0177", "appui", "Lots de vivres prêts à être remis aux ménages"],
    ["wa0178", "appui", "Bénéficiaires recevant leurs lots"],
    ["wa0179", "appui", "Vérification des lots avant remise"],
    ["wa0180", "appui", "Bénéficiaire avec son lot de céréales et d’huile"],
    ["wa0181", "appui", "Retour des bénéficiaires après la distribution"],
    ["wa0182", "appui", "Bénéficiaire emportant son lot de vivres"],
    ["wa0183", "appui", "Bénéficiaire avec son lot de vivres"],
    ["wa0184", "appui", "Vue d’ensemble du site de distribution"],
    ["wa0187", "appui", "Bénéficiaires et lots de vivres"]
  ];
  /* Vue « Tout » : on alterne les catégories pour varier les images */
  var MIXED = (function () {
    var groups = {}, order = [], out = [];
    PHOTOS.forEach(function (p) { if (!groups[p[1]]) { groups[p[1]] = []; order.push(p[1]); } groups[p[1]].push(p); });
    for (var i = 0; out.length < PHOTOS.length; i++) order.forEach(function (k) { if (groups[k][i]) out.push(groups[k][i]); });
    return out;
  })();
  var grid = document.getElementById("masonry");
  var moreBtn = document.getElementById("moreBtn");
  var filter = "all", limit = 12, visible = [];

  function render() {
    var list = filter === "all" ? MIXED : PHOTOS.filter(function (p) { return p[1] === filter; });
    visible = list.slice(0, limit);
    grid.innerHTML = visible.map(function (p, i) {
      return '<figure tabindex="0" data-i="' + i + '"><img src="assets/img/thumbs/' + p[0] + '.jpg" alt="' + p[2] + '" loading="lazy"><figcaption>' + p[2] + "</figcaption></figure>";
    }).join("");
    moreBtn.hidden = list.length <= limit;
  }
  document.querySelectorAll(".filters button").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".filters button").forEach(function (x) { x.classList.remove("is-active"); });
      b.classList.add("is-active"); filter = b.dataset.filter; limit = 12; render();
    });
  });
  moreBtn.addEventListener("click", function () { limit += 12; render(); });
  render();

  /* ---------- Visionneuse ---------- */
  var lb = document.getElementById("lightbox"), lbImg = document.getElementById("lbImg"), lbCap = document.getElementById("lbCap");
  var idx = 0, lastFocus;
  function openLb(i) {
    idx = (i + visible.length) % visible.length;
    var p = visible[idx];
    lbImg.src = "assets/img/photos/" + p[0] + ".jpg"; lbImg.alt = p[2];
    lbCap.textContent = p[2] + "  ·  " + (idx + 1) + " / " + visible.length;
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
    window.location.href = "mailto:ongmarh@yahoo.com?cc=marhabaneong@gmail.com&subject=" + encodeURIComponent("[Site web] " + d.get("objet")) + "&body=" + encodeURIComponent(body);
    note.textContent = "Merci ! Votre messagerie s’ouvre pour envoyer le message.";
  });

  var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();
})();
