import assert from 'node:assert/strict';
import test from 'node:test';
import { Linter } from 'eslint';
import readableSpacing from './readableSpacing.js';

const linter = new Linter();
const config = {
  plugins: { local: { rules: { spacing: readableSpacing } } },
  rules: { 'local/spacing': 'error' },
};

// These cases cover the top-level and nested function forms used by the presenters.
test('inserts space between imports, declarations and nested arrow functions', () => {
  const source = [
    "import a from 'a';",
    "import b from 'b';",
    'export function presenter() {',
    '  const first = () => a;',
    '  const second = () => b;',
    '  return { first, second };',
    '}',
    'export function view() {}',
  ].join('\n');
  const result = linter.verifyAndFix(source, config);

  assert.equal(result.messages.length, 0);
  assert.match(result.output, /import a[^\n]+\n\nimport b/);
  assert.match(result.output, /const first[^\n]+\n\n {2}const second/);
  assert.match(result.output, /}\n\nexport function view/);
});

test('keeps comments with their function and accepts existing spacing', () => {
  const source = 'function first() {}\n\n// Second function\nfunction second() {}';

  assert.deepEqual(linter.verify(source, config), []);
  assert.equal(linter.verifyAndFix(source, config).output, source);
});

test('does not add blank lines between ordinary related values', () => {
  const source = 'const width = 10;\nconst height = 20;';

  assert.deepEqual(linter.verify(source, config), []);
});
