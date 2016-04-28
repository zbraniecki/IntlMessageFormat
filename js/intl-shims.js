class ListFormat {
  constructor(locales, options) {}

  format(list) {
    return list.join(', ');
  }
}


Intl.ListFormat = ListFormat;
