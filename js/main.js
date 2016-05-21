document.getElementById('button1').addEventListener('click', function() {
  let resList = new Map();
  resList.set('/product/main.ftl', 'key1 = Updated Value');
  L10nService.handleEvent({lang: 'en-US', resList});
});

document.getElementById('button2').addEventListener('click', function() {
  let resList = new Map();
  resList.set('/product/main.ftl', 'key1 = Zaktualizowana wartosc');
  L10nService.handleEvent({lang: 'pl', resList});
});

document.getElementById('button3').addEventListener('click', function() {
  let resList = new Map();
  resList.set('/product/main.ftl', 'key1 = [FR] New Value');
  L10nService.handleEvent({lang: 'fr', resList});
});
