function getResourceLinks() {
  return [
    '/locales/toolkit.ftl',
    '/locales/main.ftl'
  ];
}

function init() {
  let resUris = getResourceLinks();
  let requestedLanguages = ['pl', 'en-US'];
  let resourceLanguages = L10nService.getLanguages(resUris);
  let defaultLanguage = 'en-US';

  let fallbackChain = Intl.negotiateLanguages(
    requestedLanguages,
    resourceLanguages, 
    defaultLanguage,
    ['PluralRules', 'NumberFormat', 'DateTimeFormat']
  );
  return L10nService.getResources(resUris, fallbackChain[0]).then(resList => {
    return {
      fallbackChain,
      resList
    };
  });
}


class Localization {
  constructor() {
    this._resCache = new Map();



    this.ready = init().then(({fallbackChain, resList}) => {
      this.langs = fallbackChain;
      this.lang = fallbackChain[0];
      this._ctx = new Intl.MessageFormat([this.lang]);

      this._resCache.set(this.lang, new Map());
      for (let [uri, value] of resList) {
        this._resCache.get(this.lang).set(uri, 
          FTLParser.parseResource(value).entries
        );
      }
    });
  }

  getValue(id, args) {
    for (let [key, entries] of this._resCache.get(this.lang)) {
      if (entries.hasOwnProperty(id)) {
        return this._ctx.formatEntry(entries[id], args);
      }
    }
    return 'Missing entity: ' + id;
  }
};

document.l10n = new Localization();
document.l10n.ready.then(() => {
  console.log(document.l10n.getValue('key1', { num : 5 }));
});
