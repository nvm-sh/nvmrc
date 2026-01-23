import { spawnSync } from 'child_process';
import { dirname as pathDirname, join } from 'path';
import { readFileSync, readdirSync } from 'fs';
import { stripVTControlCharacters } from 'util';

import test from 'tape';

import parseNVMRC, { isValidNVMRC } from '../index.mjs';

const {
	url,
	dirname = pathDirname((await import('url')).fileURLToPath(url)),
} = import.meta;

const fixtureDir = join(dirname, 'fixtures');

const valid = readdirSync(join(fixtureDir, 'valid'));
const invalid = readdirSync(join(fixtureDir, 'invalid'));

test('nvmrc', async (t) => {
	const bin = join(dirname, '../nvmrc.mjs');

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
			`v${(await import('module')).createRequire(url)('../package.json').version}`,
			'version is as expected',
		);
	});

	t.test('nonexistent file', async (st) => {
		const cwd = dirname;
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

			const stripped = stripVTControlCharacters(`${stdout}`);

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

			const stripped = stripVTControlCharacters(`${stderr}`);

			const lines = stripped.split('\n').map((x) => x.trim()).filter(Boolean);

			const expectedLines = [
				'invalid .nvmrc!',
				'all non-commented content (anything after # is a comment) must be either:',
				'- a single bare nvm-recognized version-ish',
				'- or, multiple distinct key-value pairs, each key/value separated by a single equals sign (=)',
				'additionally, a single bare nvm-recognized version-ish must be present (after stripping comments).',
				'Note that nvm does not understand semver ranges.',
				'non-commented content parsed:',
			];

			st.deepEqual(lines.slice(0, expectedLines.length), expectedLines);

			const expected = JSON.parse(`${readFileSync(join(cwd, 'expected.json'))}`);

			st.deepEqual(lines.slice(expectedLines.length), expected, `fixture ${fixture} produces expected warning lines`);
		});
	}
});

test('parseNVMRC', async (t) => {
	t.test('valid inputs', async (st) => {
		for (const fixture of valid) {
			const cwd = join(fixtureDir, 'valid', fixture);
			const contents = String(readFileSync(join(cwd, '.nvmrc')));
			const expected = JSON.parse(String(readFileSync(join(cwd, 'expected.json'))));

			const result = parseNVMRC(contents);

			st.ok(result.success, `fixture ${fixture} succeeds`);
			if (result.success) {
				st.deepEqual(result.options, expected, `fixture ${fixture} yields expected options`);
			}
		}
	});

	t.test('invalid inputs', async (st) => {
		for (const fixture of invalid) {
			const cwd = join(fixtureDir, 'invalid', fixture);
			const contents = String(readFileSync(join(cwd, '.nvmrc')));
			const expected = JSON.parse(String(readFileSync(join(cwd, 'expected.json'))));

			const result = parseNVMRC(contents);

			st.notOk(result.success, `fixture ${fixture} fails`);
			st.ok('errorMessage' in result, `fixture ${fixture} has errorMessage`);
			st.ok('rawOptions' in result, `fixture ${fixture} has rawOptions`);
			if (!result.success) {
				st.deepEqual(result.rawOptions, expected, `fixture ${fixture} yields expected rawOptions`);
			}
		}
	});

	t.test('returns success: true with options for valid content', async (st) => {
		const result = parseNVMRC('lts/*');

		st.deepEqual(result, {
			options: { node: 'lts/*' },
			success: true,
		});
	});

	t.test('returns success: false with errorMessage for invalid content', async (st) => {
		const result = parseNVMRC('^20');

		st.equal(result.success, false);
		if (!result.success) {
			st.ok(result.errorMessage.includes('invalid .nvmrc!'));
			st.deepEqual(result.rawOptions, ['^20']);
		}
	});

	t.test('handles key=value pairs', async (st) => {
		const result = parseNVMRC('20\nnpm=10\nyarn=1.22');

		st.deepEqual(result, {
			options: { node: '20', npm: '10', yarn: '1.22' },
			success: true,
		});
	});

	t.test('strips comments', async (st) => {
		const result = parseNVMRC('20 # this is node version\n# full line comment\nnpm=10 # npm version');

		st.deepEqual(result, {
			options: { node: '20', npm: '10' },
			success: true,
		});
	});
});

test('isValidNVMRC', async (t) => {
	t.test('returns true for valid structure', async (st) => {
		const rawOptions = ['20'];
		/** @type {[string, string][]} */
		const optionsEntries = [['node', '20']];
		const map = new Map(optionsEntries);

		st.ok(isValidNVMRC(rawOptions, optionsEntries, map));
	});

	t.test('returns true for valid structure with key=value pairs', async (st) => {
		const rawOptions = ['20', 'npm=10'];
		/** @type {[string, string][]} */
		const optionsEntries = [['node', '20'], ['npm', '10']];
		const map = new Map(optionsEntries);

		st.ok(isValidNVMRC(rawOptions, optionsEntries, map));
	});

	t.test('returns false when map size differs from entries (duplicates)', async (st) => {
		const rawOptions = ['foo=1', 'foo=2'];
		/** @type {[string, string][]} */
		const optionsEntries = [['foo', '1'], ['foo', '2']];
		const map = new Map(optionsEntries);

		st.notOk(isValidNVMRC(rawOptions, optionsEntries, map));
	});

	t.test('returns false when no node key', async (st) => {
		const rawOptions = ['npm=10'];
		/** @type {[string, string][]} */
		const optionsEntries = [['npm', '10']];
		const map = new Map(optionsEntries);

		st.notOk(isValidNVMRC(rawOptions, optionsEntries, map));
	});

	t.test('returns false when multiple bare values', async (st) => {
		const rawOptions = ['20', '22'];
		/** @type {[string, string][]} */
		const optionsEntries = [['node', '20'], ['node', '22']];
		const map = new Map(optionsEntries);

		st.notOk(isValidNVMRC(rawOptions, optionsEntries, map));
	});

	t.test('returns false for semver range prefixes', async (st) => {
		const prefixes = ['^', '~', '>', '<', '>=', '<=', '='];

		for (const prefix of prefixes) {
			const rawOptions = [`${prefix}20`];
			/** @type {[string, string][]} */
			const optionsEntries = [['node', `${prefix}20`]];
			const map = new Map(optionsEntries);

			st.notOk(isValidNVMRC(rawOptions, optionsEntries, map), `rejects ${prefix} prefix`);
		}
	});
});
