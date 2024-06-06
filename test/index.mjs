import { spawnSync } from 'child_process';
import { join } from 'path';
import { readFileSync, readdirSync } from 'fs';

import test from 'tape';

import stripColors from 'strip-color';

const fixtureDir = join(import.meta.dirname, 'fixtures');

const fixtures = readdirSync(fixtureDir);

test('nvmrc', async (t) => {
	const valid = [
		'basic',
		'basic-comments',
		'basic-with-comment',
		'basic-with-npm',
	];

	const invalid = [
		'basic-invalid',
		'invalid',
		'only-comments',
		'pre-normalized',
		'duplicate-pairs',
	];

	t.deepEqual(fixtures.sort(), valid.concat(invalid).sort(), 'all fixtures are accounted for');

	const bin = join(import.meta.dirname, '../nvmrc.mjs');

	for (const fixture of valid) {
		t.test(`fixture ${fixture}`, (st) => {
			const cwd = join(fixtureDir, fixture);

			const { status, stdout } = spawnSync(`${bin}`, { cwd });

			st.equal(status, 0, 'yields a zero exit code');

			const stripped = stripColors(`${stdout}`);

			st.doesNotThrow(() => JSON.parse(stripped), `fixture ${fixture} is valid, yields ${stripped.replace(/\n\s*/g, ' ')}`);

			const expected = JSON.parse(`${readFileSync(join(cwd, 'expected.json'))}`);

			st.deepEqual(JSON.parse(stripped), expected, `fixture ${fixture} yields expected result`);

			st.end();
		});
	}

	for (const fixture of invalid) {
		t.test(`fixture ${fixture}`, (st) => {
			const cwd = join(fixtureDir, fixture);

			const { status, stderr } = spawnSync(`${bin}`, { cwd });

			st.notEqual(status, 0, `fixture ${fixture} did not produce a zero exit code`);

			const stripped = stripColors(`${stderr}`);

			const lines = stripped.split('\n').map((x) => x.trim()).filter(Boolean);

			st.deepEqual(lines.slice(0, 6), [
				'invalid .nvmrc!',
				'all non-commented content (anything after # is a comment) must be either:',
				'- a single bare nvm-recognized version-ish',
				'- or, multiple distinct key-value pairs, each key/value separated by a single equals sign (=)',
				'additionally, a single bare nvm-recognized version-ish must be present (after stripping comments).',
				'non-commented content parsed:',
			]);

			const expected = JSON.parse(`${readFileSync(join(cwd, 'expected.json'))}`);

			st.deepEqual(lines.slice(6), expected, `fixture ${fixture} produces expected warning lines`);

			st.end();
		});
	}
});
