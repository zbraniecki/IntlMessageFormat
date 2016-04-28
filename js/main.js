let ftlResource = 'key1 = Hello World {$user}';

let entries = FTLParser.parseResource(ftlResource).entries;



let mf = new Intl.MessageFormat(navigator.languages, {
  dataLocale: ['ar', 'fr', 'de']
});

for (let id in entries) {
  let entry = entries[id];
  let str = mf.formatEntry(entry, {
    user: 'John'
  });

  console.log(str);
}
