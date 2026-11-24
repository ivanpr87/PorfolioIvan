(function(){
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const TWEAK_DEFAULTS = (
  /*EDITMODE-BEGIN*/
  {
    "dark": false,
    "accent": "#C8A96A",
    "hero": "split",
    "cards": "default",
    "density": "regular",
    "show_search": true,
    "show_manifesto": true,
    "show_emotional": true,
    "show_properties": true,
    "show_unseen": true,
    "show_differential": true,
    "show_beforeafter": true,
    "show_services": true,
    "show_owners": true,
    "show_testimonials": true
  }
);
const runtimeFlags = window.__LUJAN_RUNTIME_FLAGS__ || {};
const contracts = window.__LUJAN_CONTRACTS__ || {};
const legacyRuntime = window.__LUJAN_LEGACY_RUNTIME__ || {};
const {
  Nav,
  PageShell,
  PageMain,
  SearchBar,
  EditorialManifesto,
  EmotionalQuote,
  Properties,
  SeeUnseen,
  Differential,
  BeforeAfter,
  Services,
  ForOwners,
  Testimonials,
  Contact,
  Footer,
  useReveal,
  useParallax
} = legacyRuntime;
const catalogModel = contracts.catalogModel || {};
const initialCatalogFilters = catalogModel.search && catalogModel.search.filters && catalogModel.search.filters.initialState || {};
const devtoolsEnabled = runtimeFlags.tweaksPanel !== false;
const ThemeBridgeEvent = "lujan:theme-sync";
function useLocalTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === "object" && keyOrEdits !== null ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => __spreadValues(__spreadValues({}, prev), edits));
  }, []);
  return [values, setTweak];
}
const useTweaksBridge = typeof useTweaks === "function" ? useTweaks : useLocalTweaks;
function App() {
  const [t, setTweak] = useTweaksBridge(TWEAK_DEFAULTS);
  const [catalogFilters, setCatalogFilters] = React.useState(initialCatalogFilters);
  const [catalogAppliedFilters, setCatalogAppliedFilters] = React.useState(null);
  React.useEffect(() => {
    window.dispatchEvent(new CustomEvent(ThemeBridgeEvent, {
      detail: {
        dark: t.dark,
        density: t.density,
        accent: t.accent
      }
    }));
  }, [t.dark, t.density, t.accent]);
  useReveal();
  useParallax();
  return /* @__PURE__ */ React.createElement(PageShell, null, /* @__PURE__ */ React.createElement(Nav, { dark: t.dark, setDark: (v) => setTweak("dark", v) }), /* @__PURE__ */ React.createElement(PageMain, null, t.hero === "bleed" ? /* @__PURE__ */ React.createElement(HeroBleed, null) : /* @__PURE__ */ React.createElement(HeroSplit, null), t.show_search && /* @__PURE__ */ React.createElement(
    SearchBar,
    {
      filters: catalogFilters,
      onFiltersChange: setCatalogFilters,
      onSubmit: () => setCatalogAppliedFilters(catalogFilters)
    }
  ), t.show_manifesto && /* @__PURE__ */ React.createElement(EditorialManifesto, null), t.show_emotional && /* @__PURE__ */ React.createElement(EmotionalQuote, null), t.show_properties && /* @__PURE__ */ React.createElement(Properties, { variant: t.cards, filters: catalogAppliedFilters }), t.show_unseen && /* @__PURE__ */ React.createElement(SeeUnseen, null), t.show_differential && /* @__PURE__ */ React.createElement(Differential, null), t.show_beforeafter && /* @__PURE__ */ React.createElement(BeforeAfter, null), t.show_services && /* @__PURE__ */ React.createElement(Services, null), t.show_owners && /* @__PURE__ */ React.createElement(ForOwners, null), t.show_testimonials && /* @__PURE__ */ React.createElement(Testimonials, null), /* @__PURE__ */ React.createElement(Contact, null)), /* @__PURE__ */ React.createElement(Footer, null), devtoolsEnabled ? /* @__PURE__ */ React.createElement(TweaksPanel, null, /* @__PURE__ */ React.createElement(TweakSection, { label: "Tema" }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Modo oscuro", value: t.dark, onChange: (v) => setTweak("dark", v) }), /* @__PURE__ */ React.createElement(
    TweakColor,
    {
      label: "Color de acento",
      value: t.accent,
      options: ["#C8A96A", "#8B7355", "#7A8B78", "#B89B5E"],
      onChange: (v) => setTweak("accent", v)
    }
  ), /* @__PURE__ */ React.createElement(TweakSection, { label: "Layout" }), /* @__PURE__ */ React.createElement(
    TweakRadio,
    {
      label: "Hero",
      value: t.hero,
      options: ["split", "bleed"],
      onChange: (v) => setTweak("hero", v)
    }
  ), /* @__PURE__ */ React.createElement(
    TweakRadio,
    {
      label: "Tarjetas",
      value: t.cards,
      options: ["default", "editorial", "overlay"],
      onChange: (v) => setTweak("cards", v)
    }
  ), /* @__PURE__ */ React.createElement(
    TweakRadio,
    {
      label: "Densidad",
      value: t.density,
      options: ["cozy", "regular", "airy"],
      onChange: (v) => setTweak("density", v)
    }
  ), /* @__PURE__ */ React.createElement(TweakSection, { label: "Secciones" }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Buscador", value: t.show_search, onChange: (v) => setTweak("show_search", v) }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Manifiesto", value: t.show_manifesto, onChange: (v) => setTweak("show_manifesto", v) }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Cita emocional", value: t.show_emotional, onChange: (v) => setTweak("show_emotional", v) }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Propiedades", value: t.show_properties, onChange: (v) => setTweak("show_properties", v) }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Vemos lo que otros no ven", value: t.show_unseen, onChange: (v) => setTweak("show_unseen", v) }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Diferencial", value: t.show_differential, onChange: (v) => setTweak("show_differential", v) }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Antes / despu\xE9s", value: t.show_beforeafter, onChange: (v) => setTweak("show_beforeafter", v) }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Servicios", value: t.show_services, onChange: (v) => setTweak("show_services", v) }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Propietarios", value: t.show_owners, onChange: (v) => setTweak("show_owners", v) }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Testimonios", value: t.show_testimonials, onChange: (v) => setTweak("show_testimonials", v) })) : null);
}
const mountId = window.__LUJAN_LEGACY_ROOT_ID__ || "root";
const root = ReactDOM.createRoot(document.getElementById(mountId));
root.render(/* @__PURE__ */ React.createElement(App, null));

})();
