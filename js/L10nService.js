let resMap = new Map();
resMap.set('/locales/toolkit.ftl', ['en-US']);
resMap.set('/locales/main.ftl', ['en-US']);

let subscribers = new Map();

this.L10nService = {
  subscribe: function(uris, lang, subscriber) {
    for (let uri of uris) {
      subscribers.set(uri + ':' + lang, subscriber);
    }
  },

  getLanguages: function(uris) {
    return ['en-US'];
  },

  getResources: function(resUris, lang) {
    return new Promise(function(resolve, reject) {
      let resList = new Map();
      resList.set('/locales/toolkit.ftl', 'key1 = Original Value');
      resList.set('/locales/main.ftl', 'key2 = Value 2');
      return resolve(resList);
    });
  },

  handleEvent: function(evt) {
    let lang = evt.lang;
    let resList = evt.resList;

    callList = new Set();
    for (let [uri, value] of resList) {
      if (subscribers.has(uri + ':' + lang)) {
        callList.add(subscribers.get(uri + ':' + lang));
      }
    }

    for (let caller of callList) {
      caller.handleEvent(resList, lang);
    }
  }
};
