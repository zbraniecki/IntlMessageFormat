document.getElementById('button1').addEventListener('click', function() {
  let resList = new Map();
  resList.set('/locales/toolkit.ftl', 'key1 = Updated Value');
  L10nService.handleEvent({lang: 'en-US', resList});
});
