import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('index demo executes successfully', () => {
  const result = spawnSync(
    process.execPath,
    ['--experimental-modules', 'src/index.js'],
    {
      cwd: process.cwd(),
      encoding: 'utf8'
    }
  );

  assert.equal(result.status, 0);
  assert.match(result.stdout, /--- Create tasks ---/);
  assert.match(result.stdout, /--- Final list ---/);
  assert.equal(result.stderr, '');
});
