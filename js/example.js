
console.log(document.l10n.get('key2', 'Hello World from JS'));
console.log(document.l10n.get('key3', {
  user: 'John'
}, 'Hello World for { $user }'));

document.l10n.defineEntity('key-error-0', 'Error code 0 { $code }');
document.l10n.defineEntity('key-error-1', 'Error code 1 { $code }');

for (var i = 0; i < 2; i++) {
  console.log(document.l10n.get('key-error-' + i, {code: i});
}


document.l10n.setAttributes(elem, 'key4', {
  user: 'John',
}, 'Testing for { $user }', {
  'html:title': 'Foo'
});

document.l10n.defineEntity('key5', 'Key 5', {
  'html:title': 'Testing'
});
