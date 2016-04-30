let ftlResource = 'key1 = Today is { MY_DATE($date, day: "2-digit") }';

let entries = FTLParser.parseResource(ftlResource).entries;



let mf = new Intl.MessageFormat(navigator.languages, {
  formatters: {
    'MY_DATE': ['DATE', {year: 'numeric'}]
  }
});

for (let id in entries) {
  let entry = entries[id];
  let str = mf.formatEntry(entry, {
    user: 'John',
    date: Intl.MessageArgument('DATE', {
      month: 'short'
    }, new Date())
  });

  console.log(str);
}


document.l10n = {
  get: function(key, sourceValue) {
  }
};
