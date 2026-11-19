#! /usr/bin/env node

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, sep } from 'path';
import { parseArgs } from 'util';

import parseNVMRC from './index.mjs';

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

const result = parseNVMRC(contentsStr);

if (!result.success) {
	console.error(`\n${result.errorMessage}\n`);

	// show control characters (other than tabs) as `?`, as `nvm` does, so the parsed content prints as plain text
	// eslint-disable-next-line no-control-regex
	console.warn(`\nnon-commented content parsed:\n${result.rawOptions.join('\n').replace(/[\x01-\x08\x0B-\x1F\x7F]/g, '?')}`);

	process.exit(1);
}

console.log(JSON.stringify(result.options, null, '\t').replace(/\n\s*/g, ' '));
