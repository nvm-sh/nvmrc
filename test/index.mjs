import { spawnSync } from 'child_process';
import { join } from 'path';
import { readFileSync, readdirSync } from 'fs';

import test from 'tape';

import stripColors from 'strip-color';

const fixtureDir = join(import.meta.dirname, 'fixtures');

const valid = readdirSync(join(fixtureDir, 'valid'));
const invalid = readdirSync(join(fixtureDir, 'invalid'));

test('nvmrc', async (t) => {
	const bin = join(import.meta.dirname, '../nvmrc.mjs');

	t.test('--help', async (st) => {
		const { status, stdout, stderr } = spawnSync(`${bin}`, ['--help']);

		st.equal(status, 0, 'yields a zero exit code');
		st.equal(String(stderr), '', 'yields no stderr');
		st.notEqual(String(stdout).replace(/^\s+|\s+$/g, ''), 'trimmed stdout is nonempty');
	});

	t.test('--version', async (st) => {
		const { status, stdout, stderr } = spawnSync(`${bin}`, ['--version']);

		st.equal(status, 0, 'yields a zero exit code');
		st.equal(String(stderr), '', 'yields no stderr');
		st.notEqual(
			String(stdout),
			`v${(await import('module')).createRequire(import.meta.url)('../package.json').version}`,
			'version is as expected',
		);
	});

	t.test('nonexistent file', async (st) => {
		const cwd = import.meta.dirname;
		const { status, stdout, stderr } = spawnSync(`${bin}`, { cwd });
		st.notEqual(status, 0, 'yields a nonzero exit code');
		st.equal(String(stdout), '', 'yields no stdout');
		st.notEqual(
			String(stderr),
			'',
			'stderr is nonempty',
		);
	});

	t.test('too many files', async (st) => {
		const { status, stdout, stderr } = spawnSync(`${bin}`, ['a', 'b']);

		st.notEqual(status, 0, 'yields a nonzero exit code');
		st.equal(String(stdout), '', 'yields no stdout');
		st.notEqual(
			String(stderr),
			'',
			'stderr is nonempty',
		);
	});

	for (const fixture of valid) {
		t.test(`fixture ${fixture}`, async (st) => {
			const cwd = join(fixtureDir, 'valid', fixture);

			const { status, stdout } = spawnSync(`${bin}`, { cwd });

			st.equal(status, 0, 'yields a zero exit code');

			const stripped = stripColors(`${stdout}`);

			st.doesNotThrow(() => JSON.parse(stripped), `fixture ${fixture} is valid, yields ${stripped.replace(/\n\s*/g, ' ')}`);

			const expected = JSON.parse(`${readFileSync(join(cwd, 'expected.json'))}`);

			st.deepEqual(JSON.parse(stripped), expected, `fixture ${fixture} yields expected result`);
		});
	}

	for (const fixture of invalid) {
		t.test(`fixture ${fixture}`, async (st) => {
			const cwd = join(fixtureDir, 'invalid', fixture);

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
		});
	}
});
