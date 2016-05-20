let resMap = new Map();
resMap.set('/locales/toolkit.ftl', ['en-US']);
resMap.set('/locales/main.ftl', ['en-US']);

this.L10nService = {
  subscribe: function(uris, subscriber) {
  },

  getLanguages: function(uris) {
    return ['en-US'];
  },

  getResources: function(resUris, lang) {
    return new Promise(function(resolve, reject) {
      let resList = new Map();
      resList.set('/locales/toolkit.ftl', 'key1 = Value { $num }');
      resList.set('/locales/main.ftl', 'key2 = Value 2');
      return resolve(resList);
    });
  }
};
