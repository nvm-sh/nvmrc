#! /usr/bin/env node

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, sep } from 'path';
import { parseArgs } from 'util';

const {
	values: {
		help,
		version,
	},
	positionals,
} = parseArgs({
	allowPositionals: true,
	options: {
		help: { type: 'boolean' },
		version: { type: 'boolean' },
	},
});

const cwd = process.cwd();

if (help) {
	console.log(`nvmrc

command-line tool to validate a \`.nvmrc\` file

Positionals:
  <dir>  a relative path to a directory containing a \`.nvmrc\` file [default: \`${cwd}\`]

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]`);
	process.exit(0);
} else if (version) {
	console.log(`v${(await import('module')).createRequire(import.meta.url)('./package.json').version}`);
	process.exit(0);
} else if (positionals.length > 1) {
	console.error(`expected exactly zero or one positional arguments; got ${positionals.length}`);
}

const [dir = cwd] = positionals;

const file = join(dir, '.nvmrc');

if (!existsSync(file)) {
	console.error(`\`.nvmrc\` file not found in \`${dir.replace(sep === '/' ? /\/?$/ : /\\?$/, sep)}\``);
	process.exit(1);
}

const contentsP = readFile(file);

const contentsStr = `${await contentsP}`;

const rawOptions = contentsStr
	.split('\n')
	.map((x) => x.replace(/#.*$/, '').trim())
	.filter(Boolean);

const optionsEntries = rawOptions.map((x) => ((/[=]/).test(x)
	? x.split('=').map((y) => y.trim())
	: ['node', x]
));

const map = new Map(optionsEntries);

if (map.size !== optionsEntries.length || !map.has('node') || rawOptions.filter((x) => !x.includes('=')).length !== 1) {
	console.error(`
invalid .nvmrc!
all non-commented content (anything after # is a comment) must be either:
  - a single bare nvm-recognized version-ish
  - or, multiple distinct key-value pairs, each key/value separated by a single equals sign (=)

additionally, a single bare nvm-recognized version-ish must be present (after stripping comments).
`);

	console.warn(`
non-commented content parsed:
${rawOptions.join('\n')}`);

	process.exit(1);
}

const options = Object.fromEntries(optionsEntries);

console.log(JSON.stringify(options, null, '\t').replace(/\n\s*/g, ' '));
