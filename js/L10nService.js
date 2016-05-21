let subscribers = new Map();

let resCache = new Map();

function load(url) {
  let async = false;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (xhr.overrideMimeType) {
      xhr.overrideMimeType('text/plain');
    }

    xhr.open('GET', url, async);

    xhr.addEventListener('load', e => {
      if (e.target.status === 200 ||
          e.target.status === 0) {
        resolve(e.target.response);
      } else {
        reject(new L10nError('Not found: ' + url));
      }
    });
    xhr.addEventListener('error', reject);
    xhr.addEventListener('timeout', reject);

    xhr.send(null);
  });
}

this.L10nService = {
  start: function() {
    this._packagedLanguages = ['en-US', 'pl'];
    this._registeredResourcePaths = new Set([
      '/product/main.ftl',
      '/toolkit/brand.dtd'
    ]);
  },

  subscribe: function(uris, langs, subscriber) {
    for (let lang of langs) {
      for (let uri of uris) {
        subscribers.set(uri + ':' + lang, subscriber);
      }
    }
  },

  getLanguages: function(uris) {
    return this._packagedLanguages;
  },

  getResources: function(resUris, lang) {
    let resList = [];
    for (let uri of resUris) {
      if (resCache.has(uri + ':' + lang)) {
        resList.push([uri, resCache.get(uri + ':' + lang)]);
      } else {
        let path = './data/' + lang + uri;
        resList.push(load(path).then(function(uri, text) { 
          return [uri, text];
        }.bind(this, uri)));
      }
    }
    return Promise.all(resList).then(resListArray => {
      return new Map(resListArray);
    });
  },

  handleEvent: function(evt) {
    let lang = evt.lang;
    let resList = evt.resList;

    callList = new Set();
    for (let [uri, value] of resList) {
      resCache.set(uri + ':' + lang, value);
      if (subscribers.has(uri + ':' + lang)) {
        callList.add(subscribers.get(uri + ':' + lang));
      }
    }

    for (let caller of callList) {
      caller.handleEvent(resList, lang);
    }
  }
};
