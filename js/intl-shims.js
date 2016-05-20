class ListFormat {
  constructor(locales, options) {}

  format(list) {
    return list.join(', ');
  }
}


const pluralRules = {
  'en-US': (n) => { return n === 1 ? 'one' : 'other' }
};
class PluralRules {
  constructor(locales, options) {
    this.locale = Array.isArray(locales) ? locales[0] : locales;
    this.pluralRule = pluralRules[this.locale];
  }

  select(x) {
    const n = parseInt(x);
    return this.pluralRule(n);
  }
}

Intl.ListFormat = ListFormat;
Intl.PluralRules = PluralRules;
