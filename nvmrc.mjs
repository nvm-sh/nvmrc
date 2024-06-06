#! /usr/bin/env node

import { readFile } from 'fs/promises';
import { join } from 'path';

const contentsP = readFile(join(process.cwd(), '.nvmrc'));

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
${rawOptions.join('\n')}
`);

	process.exit(1);
}

const options = Object.fromEntries(optionsEntries);

console.log(JSON.stringify(options, null, '\t').replace(/\n\s*/g, ' '));
