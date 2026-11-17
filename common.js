/* Routines — données partagées, réglages et utilitaires.
   Tout est stocké dans le navigateur (localStorage) : rien ne quitte l'appareil. */
var R = (function () {
  "use strict";

  var ICONS = {
    soleil:   { n: "Soleil / réveil", d: '<circle cx="12" cy="12" r="4.4"/><path d="M12 2.2v2.3M12 19.5v2.3M2.2 12h2.3M19.5 12h2.3M5.1 5.1l1.6 1.6M17.3 17.3l1.6 1.6M18.9 5.1l-1.6 1.6M6.7 17.3l-1.6 1.6"/>' },
    vetement: { n: "Vêtements",       d: '<path d="M8.6 3.2 5 5.4v5h2.6v10.4h8.8V10.4H19v-5l-3.6-2.2z"/><path d="M8.6 3.2a3.4 3.4 0 0 0 6.8 0"/>' },
    tasse:    { n: "Repas / tasse",   d: '<path d="M4 7.2h11.5v6.6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M15.5 9.2h2.3a2.4 2.4 0 0 1 0 4.8h-2.3"/><path d="M4.5 20.8h12.5"/>' },
    brosse:   { n: "Brosse à dents",  d: '<rect x="8" y="4.2" width="8" height="5" rx="2"/><path d="M12 9.2v11.2"/><path d="M9.6 4.2V2.4M12 4.2V2.4M14.4 4.2V2.4"/>' },
    peigne:   { n: "Peigne",          d: '<rect x="3.6" y="5.4" width="16.8" height="5.2" rx="2.2"/><path d="M7 10.6v4.4M10.3 10.6v4.4M13.7 10.6v4.4M17 10.6v4.4"/>' },
    cartable: { n: "Cartable",        d: '<path d="M5 10.2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v8.4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M9.5 20.6v-4.8h5v4.8"/><path d="M9.2 5.2V4.3a2.8 2.8 0 0 1 5.6 0v.9"/>' },
    papiers:  { n: "Papiers",         d: '<rect x="5.2" y="3.2" width="11.6" height="15.6" rx="1.8"/><path d="M8.2 8h5.6M8.2 11h5.6M8.2 14h3.4"/><path d="M8 21h11.5a1.8 1.8 0 0 0 1.8-1.8V7"/>' },
    courir:   { n: "Bouger / sport",  d: '<circle cx="14.2" cy="4.9" r="2.1"/><path d="M13.2 8.2 9.6 11.2l1.6 3.5-2.1 5.6"/><path d="M11.2 11.7l4 1.5 1 4.1"/><path d="M9.6 11.2 5 12.7"/>' },
    crayon:   { n: "Devoirs / crayon",d: '<path d="M4 20.2l1-4.6L16 4.6a2.1 2.1 0 0 1 3 3L8 18.6z"/><path d="M14 6.6l3 3"/>' },
    verre:    { n: "Boire / pause",   d: '<path d="M7 4h10l-1.1 16.2H8.1z"/><path d="M7.4 10.2h9.2"/>' },
    goutte:   { n: "Douche / eau",    d: '<path d="M12 3.2s5.9 6.4 5.9 10.2A5.9 5.9 0 0 1 6.1 13.4C6.1 9.6 12 3.2 12 3.2z"/>' },
    livre:    { n: "Lecture",         d: '<path d="M4 4.6h5.9a2 2 0 0 1 2 2v12.8a2 2 0 0 0-2-2H4z"/><path d="M20 4.6h-5.9a2 2 0 0 0-2 2v12.8a2 2 0 0 1 2-2H20z"/>' },
    etoile:   { n: "Étoile",          d: '<path d="M12 3.2l2.6 5.6 6.1.7-4.5 4.3 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.3 6.1-.7z"/>' },
    lune:     { n: "Lune / dodo",     d: '<path d="M20 14.6A8.6 8.6 0 0 1 9.4 4a8.6 8.6 0 1 0 10.6 10.6z"/>' }
  };

  var THEMES = {
    orange: { n: "Orange (matin)", bg: "#FFF8EE", ink: "#231B12", acc: "#B04E0C", accdark: "#8A3D08", muted: "#6B5742",
              tint: "#FDEBD8", bord: "#EFD9BE", track: "#F2DFC7", soft: "#E0BE94", donetxt: "#8A7560", box: "#CBB393" },
    bleu:   { n: "Bleu (soir)",    bg: "#F4F6FB", ink: "#15192B", acc: "#3B4C96", accdark: "#2C3A78", muted: "#505B86",
              tint: "#E3E8F8", bord: "#D7DEF0", track: "#DCE3F4", soft: "#B9C4E4", donetxt: "#6E7899", box: "#A9B4D8" },
    vert:   { n: "Vert",           bg: "#F3F8F4", ink: "#14231B", acc: "#2F6F52", accdark: "#22543D", muted: "#4E6B5C",
              tint: "#DDEFE4", bord: "#CFE3D6", track: "#D6E9DD", soft: "#A9CDB7", donetxt: "#6B8577", box: "#9FC2AD" },
    violet: { n: "Violet",         bg: "#F8F5FC", ink: "#1F1629", acc: "#6A3FA0", accdark: "#52307D", muted: "#66587A",
              tint: "#EDE4F8", bord: "#E2D7F0", track: "#E6DCF4", soft: "#C8B5E3", donetxt: "#857799", box: "#BBA6D9" }
  };

  var DEFAULTS = {
    v: 1,
    name: "",
    order: ["matin", "soir"],
    routines: {
      matin: {
        short: "Le matin",
        title: "Ma routine du matin",
        theme: "orange",
        endIcon: "etoile",
        motto: "Une étape à la fois. Le chrono décide, pas les adultes.",
        endTitle: "Tout est fait. Bravo !",
        endText: "Bonne journée !",
        rulesTitle: "Les 3 règles du matin",
        rules: [
          ["Une seule étape", "je fais celle où j'en suis, pas les suivantes."],
          ["Le minuteur décide", "ce ne sont pas les adultes qui me pressent."],
          ["Je démarre petit", "si c'est dur, je fais juste les 10 premières secondes."]
        ],
        tasks: [
          { label: "Je me lève", detail: "je sors du lit tout de suite", mins: 1, icon: "soleil" },
          { label: "Je m'habille", detail: "mes vêtements sont déjà prêts", mins: 5, icon: "vetement" },
          { label: "Petit-déjeuner", detail: "à table, sans écran", mins: 10, icon: "tasse" },
          { label: "Je me brosse les dents", detail: "en haut, en bas, partout", mins: 2, icon: "brosse" },
          { label: "Je me coiffe", detail: "", mins: 3, icon: "peigne" },
          { label: "Cartable, manteau, chaussures", detail: "le cartable était prêt hier soir", mins: 4, icon: "cartable" }
        ]
      },
      soir: {
        short: "Le soir",
        title: "Ma routine du soir",
        theme: "bleu",
        endIcon: "lune",
        motto: "Dans l'ordre, de haut en bas. Le chrono décide, pas les adultes.",
        endTitle: "Tout est fait. Bravo !",
        endText: "Bonne nuit !",
        rulesTitle: "Les 3 règles du soir",
        rules: [
          ["Je commence petit", "juste le premier exercice. Après, c'est plus facile."],
          ["La pause est obligatoire", "entre les deux blocs, je bouge pour de vrai."],
          ["Tout est prêt ce soir", "comme ça, demain matin est facile."]
        ],
        tasks: [
          { label: "Je vide mon cartable", detail: "je donne les papiers à signer tout de suite", mins: 2, icon: "papiers" },
          { label: "Goûter, puis je bouge", detail: "sortir, courir, sauter : le cerveau se recharge", mins: 20, icon: "courir" },
          { label: "Devoirs — bloc 1", detail: "minuteur visible, téléphone loin", mins: 15, icon: "crayon" },
          { label: "Pause", detail: "je me lève, je bois, je m'étire. Pas d'écran.", mins: 5, icon: "verre" },
          { label: "Devoirs — bloc 2", detail: "et c'est fini pour aujourd'hui", mins: 15, icon: "crayon" },
          { label: "Je prépare mes vêtements", detail: "posés sur la chaise, prêts pour demain", mins: 5, icon: "vetement" },
          { label: "Je range mon cartable", detail: "je le pose à côté de la porte", mins: 3, icon: "cartable" },
          { label: "Douche et dents", detail: "", mins: 15, icon: "goutte" },
          { label: "Lecture au calme, puis au lit", detail: "lumière douce, pas d'écran avant de dormir", mins: 20, icon: "livre" }
        ]
      }
    }
  };

  var KEY = "routines-config-v1";
  var MAX_TASKS = 15;

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function str(v, max, dflt) {
    if (typeof v !== "string") { return dflt; }
    return v.slice(0, max);
  }

  /* Nettoie une config venue du stockage ou d'un lien de partage. */
  function sanitize(raw) {
    var base = clone(DEFAULTS);
    if (!raw || typeof raw !== "object") { return base; }
    var out = { v: 1, name: str(raw.name, 40, ""), order: base.order, routines: {} };
    base.order.forEach(function (id) {
      var d = base.routines[id];
      var r = (raw.routines && raw.routines[id]) || {};
      var o = {
        short: str(r.short, 30, d.short) || d.short,
        title: str(r.title, 60, d.title) || d.title,
        theme: THEMES[r.theme] ? r.theme : d.theme,
        endIcon: ICONS[r.endIcon] ? r.endIcon : d.endIcon,
        motto: str(r.motto, 120, d.motto),
        endTitle: str(r.endTitle, 60, d.endTitle) || d.endTitle,
        endText: str(r.endText, 80, d.endText),
        rulesTitle: str(r.rulesTitle, 60, d.rulesTitle),
        rules: d.rules,
        tasks: d.tasks
      };
      if (Array.isArray(r.rules)) {
        o.rules = r.rules.slice(0, 5).map(function (x) {
          return Array.isArray(x) ? [str(x[0], 60, ""), str(x[1], 140, "")] : ["", ""];
        }).filter(function (x) { return x[0] || x[1]; });
      }
      if (Array.isArray(r.tasks)) {
        var t = r.tasks.slice(0, MAX_TASKS).map(function (x) {
          x = x || {};
          var m = Math.round(Number(x.mins));
          return {
            label: str(x.label, 60, "").trim(),
            detail: str(x.detail, 100, ""),
            mins: isFinite(m) ? Math.min(120, Math.max(1, m)) : 5,
            icon: ICONS[x.icon] ? x.icon : "etoile"
          };
        }).filter(function (x) { return x.label; });
        if (t.length) { o.tasks = t; }
      }
      out.routines[id] = o;
    });
    return out;
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      return sanitize(raw ? JSON.parse(raw) : null);
    } catch (e) { return clone(DEFAULTS); }
  }
  function save(cfg) {
    try { window.localStorage.setItem(KEY, JSON.stringify(cfg)); return true; } catch (e) { return false; }
  }
  function reset() {
    try { window.localStorage.removeItem(KEY); } catch (e) {}
    return clone(DEFAULTS);
  }

  /* Lien de partage : la config est encodée dans le #fragment (jamais envoyée au serveur). */
  function encode(cfg) {
    var s = JSON.stringify(cfg);
    return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function decode(token) {
    try {
      var b = token.replace(/-/g, "+").replace(/_/g, "/");
      while (b.length % 4) { b += "="; }
      return sanitize(JSON.parse(decodeURIComponent(escape(atob(b)))));
    } catch (e) { return null; }
  }

  function svg(icon, size, stroke) {
    var i = ICONS[icon] || ICONS.etoile;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'
      + (stroke || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + i.d + "</svg>";
  }

  function applyTheme(themeId) {
    var t = THEMES[themeId] || THEMES.orange;
    var s = document.documentElement.style;
    Object.keys(t).forEach(function (k) { if (k !== "n") { s.setProperty("--" + k, t[k]); } });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) { meta.setAttribute("content", t.bg); }
  }

  function total(tasks) {
    var m = tasks.reduce(function (a, t) { return a + t.mins; }, 0);
    if (m < 60) { return m + " min"; }
    var h = Math.floor(m / 60), r = m % 60;
    return h + " h" + (r ? " " + (r < 10 ? "0" : "") + r : "");
  }

  function routineId() {
    var id = new URLSearchParams(window.location.search).get("r");
    return DEFAULTS.routines[id] ? id : "matin";
  }

  /* Mode hors ligne / installable. */
  if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }

  function isStandalone() {
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  }

  return {
    isStandalone: isStandalone,
    ICONS: ICONS, THEMES: THEMES, DEFAULTS: DEFAULTS, MAX_TASKS: MAX_TASKS,
    load: load, save: save, reset: reset, sanitize: sanitize, encode: encode, decode: decode,
    svg: svg, applyTheme: applyTheme, total: total, routineId: routineId, clone: clone
  };
})();
