function getResourceLinks() {
  return new Set([
    '/toolkit/brand.ftl',
    '/product/main.ftl'
  ]);
}


function init() {
  let resUris = getResourceLinks();
  let resourceLanguages = L10nService.getLanguages(resUris);
  let requestLanguages = ['fr', 'pl', 'en-US'];
  let defaultLanguage = 'en-US';

  let fallbackChain = Intl.negotiateLanguages(
    requestLanguages,
    resourceLanguages, 
    defaultLanguage,
    ['PluralRules', 'NumberFormat', 'DateTimeFormat']
  );
  return L10nService.getResources(resUris, fallbackChain[0]).then(resList => {
    return {
      fallbackChain,
      requestLanguages,
      resList
    };
  });
}


class Localization {
  constructor() {
    this._resCache = new Map();

    this.ready = init().then(({fallbackChain, requestLanguages, resList}) => {
      this.langs = fallbackChain;
      this.lang = fallbackChain[0];
      this._ctx = new Intl.MessageFormat([this.lang]);

      this._resCache.set(this.lang, new Map());
      for (let [uri, value] of resList) {
        this._resCache.get(this.lang).set(uri, 
          FTLParser.parseResource(value).entries
        );
      }
      L10nService.subscribe(new Set(resList.keys()), requestLanguages, this);
      this.translateDocument();
    });
  }

  handleEvent(resList, lang) {
    for (let [resId, value] of resList) {
      this._resCache.get(lang).set(resId,
        FTLParser.parseResource(value).entries
      );
    }
    this.translateDocument();
  }

  getValue(id, args) {
    for (let [key, entries] of this._resCache.get(this.lang)) {
      if (entries.hasOwnProperty(id)) {
        return this._ctx.formatEntry(entries[id], args);
      }
    }
    return 'Missing entity: ' + id;
  }

  translateDocument() {
    let elems = document.querySelectorAll('*[data-l10n-id]');

    for (let elem of elems) {
      let id = elem.getAttribute('data-l10n-id');
      elem.textContent = this.getValue(id);
    }
  }
};

L10nService.start();
document.l10n = new Localization();
