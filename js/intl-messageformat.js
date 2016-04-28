function formatMessage(mf, args, entries, msg) {
  if (typeof msg === 'string') {
    return msg;
  }
  return msg.map(elem => {
    if (typeof elem === 'string') {
      return elem;
    } else {
      if (elem.length === 1) {
        return formatPlaceable(mf, args, entries, elem[0]);
      }

      let lf = new Intl.ListFormat(mf.locale);

      return lf.format(elem.map(formatPlaceable.bind(null, mf, args, entries)));
    }
  }).join('');
}

function formatPlaceable(mf, args, entries, p) {
  switch (p.type) {
    case 'ext':
      return formatArgument(mf, args, args[p.name]);
    case 'ref':
      return formatMessage(mf, args, entries, entries[p.name]);
    case 'call':
      let {values, options} = resolveCEArgs(args, p.args);
      return resolveCallExpression(
        mf, args, p.name.name, options, values)
    default:
      throw new Error('Unknown placeable type: ' + p);
  }
}

function formatArgument(mf, args, arg) {
  if (typeof arg === 'string') {
    return arg;
  }

  let builtin;
  let values;
  let options;
  if (typeof arg === 'object' && arg.hasOwnProperty('formatter')) {
    builtin = arg.formatter;
    values = arg.values;
    options = arg.options;
  }
  if (typeof arg === 'number') {
    builtin = 'NUMBER';
    values = [arg];
  }
  if (arg instanceof Date) {
    builtin = 'DATE';
    values = [arg];
  }
  return resolveCallExpression(mf, args, builtin, options, values);
}

function resolveCallExpression(mf, args, builtin, options, values) {
  switch (builtin) {
    case 'NUMBER':
      return values[0].toLocaleString(mf.locale, options);
    case 'DATE':
      return values[0].toLocaleString(mf.locale, options);
    default:
      formatter = mf.formatters[builtin];
      return resolveCallExpression(mf,
        args,
        formatter[0],
        Object.assign(formatter[1] || {}, options),
        values);
  }
}

function resolveCEArgs(args, argList) {
  let values = [];
  let options = {};

  argList.forEach(arg => {
    switch (arg.type) {
      case 'ext':
        let val = args[arg.name];
        if (typeof val === 'object' && val.hasOwnProperty('formatter')) {
          values = values.concat(val.values);
          options = val.options
        } else {
          values.push(args[arg.name]);
        }
        break;
      case 'kv':
        options[arg.name] = arg.val;
        break;
      default:
        console.log(arg);
        return arg;
    }
  });
  return {values, options}
}

class MessageFormat {
  constructor(locales, options = {}) {
    this.args = options.args || {};
    this.entries = options.entries || {};
    this.formatters = options.formatters || {};
    this.locale = locales ? locales[0] : navigator.language;
  }

  formatEntry(entry, args, entries) {
    let a = Object.assign(this.args, args);
    let e = Object.assign(this.entries, entries);
    return formatMessage(this, a, e, entry);
  }
}

function createMessageArgument(formatter, options, values) {
  if (values === undefined) {
    return (values) => {
      if (values === undefined) {
        throw new Error('Cannot resolve Argument without a value');
      }
      if (!Array.isArray(values)) {
        values = [values];
      }
      return {
        formatter,
        options,
        values
      };
    };
  }
  if (!Array.isArray(values)) {
    values = [values];
  }
  return {
    formatter,
    options,
    values
  };
}

Intl.MessageFormat = MessageFormat;
Intl.MessageArgument = createMessageArgument;
