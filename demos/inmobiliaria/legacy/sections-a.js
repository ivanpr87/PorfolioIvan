(function(){
const Icon = {
  arrow: () => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", className: "ic", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M5 12h14M13 6l6 6-6 6", strokeLinecap: "round", strokeLinejoin: "round" })),
  chev: ({ d = "r" }) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", className: "ic", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: d === "l" ? "M14 6l-6 6 6 6" : d === "u" ? "M6 14l6-6 6 6" : d === "d" ? "M6 10l6 6 6-6" : "M10 6l6 6-6 6", strokeLinecap: "round", strokeLinejoin: "round" })),
  sun: () => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", className: "ic", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "4" }), /* @__PURE__ */ React.createElement("path", { d: "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4", strokeLinecap: "round" })),
  moon: () => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", className: "ic", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z", strokeLinecap: "round", strokeLinejoin: "round" })),
  search: () => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", className: "ic", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "7" }), /* @__PURE__ */ React.createElement("path", { d: "M20 20l-3.5-3.5", strokeLinecap: "round" })),
  heart: () => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", className: "ic", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z", strokeLinejoin: "round" })),
  bed: () => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", className: "ic", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 14h18M7 9V7a2 2 0 0 1 2-2h2a1 1 0 0 1 1 1v3", strokeLinecap: "round", strokeLinejoin: "round" })),
  bath: () => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", className: "ic", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3zM7 12V6a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2M6 19l-1 2M18 19l1 2", strokeLinecap: "round", strokeLinejoin: "round" })),
  area: () => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", className: "ic", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M4 4h6M4 4v6M20 20h-6M20 20v-6M4 4l6 6M20 20l-6-6", strokeLinecap: "round" })),
  rooms: () => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", className: "ic", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M3 21V8l9-5 9 5v13M3 21h18M10 21v-7h4v7", strokeLinecap: "round", strokeLinejoin: "round" })),
  car: () => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", className: "ic", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M5 17h14M5 17l1.5-5a2 2 0 0 1 2-1.5h7a2 2 0 0 1 2 1.5L19 17M5 17v3M19 17v3M8 14h0M16 14h0", strokeLinecap: "round", strokeLinejoin: "round" })),
  tree: () => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", className: "ic", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M12 21v-6M9 15h6M12 3a5 5 0 0 1 4 8 4 4 0 0 1-2 7h-4a4 4 0 0 1-2-7 5 5 0 0 1 4-8z", strokeLinecap: "round", strokeLinejoin: "round" })),
  whatsapp: () => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", style: { width: "100%", height: "100%" } }, /* @__PURE__ */ React.createElement("path", { fill: "currentColor", d: "M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2zm5.45 14.18c-.23.65-1.35 1.24-1.88 1.32-.48.07-1.1.1-1.77-.11-.41-.13-.93-.3-1.6-.59-2.83-1.22-4.68-4.07-4.82-4.26-.14-.19-1.16-1.54-1.16-2.94 0-1.4.74-2.09 1-2.38.26-.29.56-.36.74-.36s.37 0 .53.01c.17.01.4-.06.62.47.23.55.79 1.91.86 2.05.07.14.11.3.02.49-.09.19-.13.3-.27.46-.13.16-.28.36-.4.48-.13.13-.27.27-.12.53.15.26.65 1.07 1.4 1.74.95.85 1.76 1.11 2.02 1.24.26.13.41.11.56-.06.15-.18.65-.76.82-1.02.17-.26.34-.21.57-.13.23.09 1.49.7 1.74.83.26.13.42.19.49.3.07.11.07.66-.16 1.31z" }))
};
const contracts = window.__LUJAN_CONTRACTS__ || {};
const brandConfig = contracts.brand || {};
const contactConfig = contracts.contact || {};
const waLink = contracts.waLink || (() => "#contacto");
const WaButton = ({
  msg,
  label = contactConfig.primaryWhatsappLabel || "Hablar por WhatsApp",
  variant = "wa",
  className = ""
}) => /* @__PURE__ */ React.createElement(
  "a",
  {
    href: waLink(msg),
    target: "_blank",
    rel: "noopener",
    className: `btn btn--${variant} ${className}`
  },
  /* @__PURE__ */ React.createElement("span", { className: "wa-mark" }, /* @__PURE__ */ React.createElement(Icon.whatsapp, null)),
  /* @__PURE__ */ React.createElement("span", { className: "btn__label" }, label)
);
const HERO_CONTENT = brandConfig.hero || {};
const BRAND_TERRITORY = brandConfig.territory || "Luj\xE1n \xB7 Buenos Aires";
const BRAND_SINCE = brandConfig.since || "est. 2014";
const HERO_DESCRIPTION = brandConfig.description || "Te ayudamos a elegir, imaginar y transformar el pr\xF3ximo cap\xEDtulo de tu vida. Combinamos mirada inmobiliaria, dise\xF1o de interiores e inteligencia artificial para revelar el verdadero potencial de cada propiedad \u2014 en Luj\xE1n y alrededores.";
const HERO_SHORT_DESCRIPTION = brandConfig.shortDescription || "Inmobiliaria boutique en Luj\xE1n y alrededores. Te ayudamos a elegir, imaginar y transformar tu pr\xF3ximo hogar.";
function HeroSplit() {
  return /* @__PURE__ */ React.createElement("section", { className: "hero wrap", "data-screen-label": "01 Hero" }, /* @__PURE__ */ React.createElement("div", { className: "hero__left" }, /* @__PURE__ */ React.createElement("div", { className: "hero__meta", "data-reveal": true }, /* @__PURE__ */ React.createElement("span", { className: "eyebrow" }, BRAND_TERRITORY), /* @__PURE__ */ React.createElement("span", { className: "yr" }, BRAND_SINCE)), /* @__PURE__ */ React.createElement("h1", { className: "hero__title", "data-reveal": true, "data-reveal-delay": "0.06" }, "No vendemos", /* @__PURE__ */ React.createElement("br", null), "propiedades. ", /* @__PURE__ */ React.createElement("span", { className: "amp" }, "\u2014"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("em", null, "Dise\xF1amos"), " hogares."), /* @__PURE__ */ React.createElement("p", { className: "hero__lede", "data-reveal": true, "data-reveal-delay": "0.12" }, HERO_DESCRIPTION), /* @__PURE__ */ React.createElement("div", { className: "hero__cta-row", "data-reveal": true, "data-reveal-delay": "0.18" }, /* @__PURE__ */ React.createElement("a", { href: "#propiedades", className: "btn" }, /* @__PURE__ */ React.createElement("span", { className: "dot" }), HERO_CONTENT.primaryCtaLabel || "Ver propiedades"), /* @__PURE__ */ React.createElement(WaButton, { msg: HERO_CONTENT.whatsappMessage || contactConfig.defaultWhatsappMessage, variant: "wa" }))), /* @__PURE__ */ React.createElement("aside", { className: "hero__right", "data-reveal": true, "data-reveal-delay": "0.14" }, /* @__PURE__ */ React.createElement("div", { className: "hero__img", "data-parallax": "0.035", "data-parallax-limit": "20" }, /* @__PURE__ */ React.createElement(
    "image-slot",
    {
      id: "hero-main",
      shape: "rect",
      radius: "2",
      src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400&q=80&auto=format&fit=crop",
      placeholder: "Interior c\xE1lido \xB7 luz natural \xB7 4:5",
      style: { position: "absolute", inset: 0 }
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "hero__caption" }, /* @__PURE__ */ React.createElement("span", null, "Casa quinta \xB7 Open Door ", /* @__PURE__ */ React.createElement("span", { style: { fontStyle: "italic", color: "var(--ink-mute)" } }, "\u2014 Luj\xE1n")), /* @__PURE__ */ React.createElement("span", { className: "num" }, "\u2116 001 / 2025"))), /* @__PURE__ */ React.createElement("div", { className: "hero__scroll", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("span", null, "Scroll"), /* @__PURE__ */ React.createElement("span", { className: "line" })));
}
function HeroBleed() {
  return /* @__PURE__ */ React.createElement("section", { className: "hero hero--bleed", "data-screen-label": "01 Hero" }, /* @__PURE__ */ React.createElement("div", { className: "hero__bg", "data-parallax": "0.025", "data-parallax-limit": "18" }, /* @__PURE__ */ React.createElement(
    "image-slot",
    {
      id: "hero-bleed",
      shape: "rect",
      src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=2000&q=80&auto=format&fit=crop",
      placeholder: "Imagen arquitect\xF3nica full-bleed",
      style: { position: "absolute", inset: 0, width: "100%", height: "100%" }
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "hero__overlay" }, /* @__PURE__ */ React.createElement("div", { "data-reveal": true, style: { display: "flex", alignItems: "center", gap: 28, marginBottom: 48 } }, /* @__PURE__ */ React.createElement("span", { className: "eyebrow", style: { color: "rgba(244,241,234,.7)" } }, BRAND_TERRITORY), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: 18, color: "rgba(244,241,234,.6)" } }, BRAND_SINCE)), /* @__PURE__ */ React.createElement("h1", { className: "hero__title", "data-reveal": true, "data-reveal-delay": "0.06" }, "No vendemos", /* @__PURE__ */ React.createElement("br", null), "propiedades. ", /* @__PURE__ */ React.createElement("span", { className: "amp" }, "\u2014"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("em", null, "Dise\xF1amos"), " hogares."), /* @__PURE__ */ React.createElement("p", { className: "hero__lede", "data-reveal": true, "data-reveal-delay": "0.12", style: { marginTop: 36, maxWidth: "52ch", fontSize: 19 } }, HERO_SHORT_DESCRIPTION), /* @__PURE__ */ React.createElement("div", { className: "hero__cta-row", "data-reveal": true, "data-reveal-delay": "0.18" }, /* @__PURE__ */ React.createElement("a", { href: "#propiedades", className: "btn" }, /* @__PURE__ */ React.createElement("span", { className: "dot" }), " ", HERO_CONTENT.primaryCtaLabel || "Ver propiedades"), /* @__PURE__ */ React.createElement(WaButton, { msg: HERO_CONTENT.whatsappMessage || contactConfig.defaultWhatsappMessage, variant: "wa" }))));
}
Object.assign(window, { Icon, WaButton, HeroSplit, HeroBleed });

window.HeroSplit=HeroSplit; window.HeroBleed=HeroBleed;
})();
