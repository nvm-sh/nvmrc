const { fromEntries } = Object;

/** @type {(x: string) => string} */
function trimWhitespace(x) {
	return x.replace(/^[^\S\uFEFF]+|[^\S\uFEFF]+$/g, '');
}

/** @type {(contentsStr: string) => string[]} */
function parseRawOptions(contentsStr) {
	return contentsStr
		.split(/\r?\n/)
		.map((x) => trimWhitespace(x.replace(/#.*$/, '')))
		.filter(Boolean);
}

/** @type {(x: string) => boolean} */
function isKeyValuePair(x) {
	return (/^([^=]+)=([\s\S]*)$/).test(x);
}

/** @type {(rawOptions: string[]) => [string, string][]} */
function parseOptionsEntries(rawOptions) {
	return rawOptions.map((x) => {
		const pair = (/^([^=]+)=([\s\S]*)$/).exec(x);
		if (!pair) {
			return /** @type {const} */ (['node', x]);
		}
		const [, key, value] = pair;
		return [trimWhitespace(key), trimWhitespace(value)];
	});
}

/** @type {(rawOptions: string[], optionsEntries: [string, string][], map: Map<string, string>) => boolean} */
export function isValidNVMRC(rawOptions, optionsEntries, map) {
	return !(
		map.size !== optionsEntries.length
		|| !map.has('node')
		|| rawOptions.filter((x) => !isKeyValuePair(x)).length !== 1
		|| (/^\s*[~^><=]/).test(map.get('node').trim())
	);
}

/** @typedef {{ success: true, options: Record<string, string> }} ParseResult */
/** @typedef {{ success: false, errorMessage: string, rawOptions: string[] }} ParseError */

const ERROR_MESSAGE = `invalid .nvmrc!
all non-commented content (anything after # is a comment) must be either:
  - a single bare nvm-recognized version-ish
  - or, multiple distinct key-value pairs, each key/value separated by a single equals sign (=)

additionally, a single bare nvm-recognized version-ish must be present (after stripping comments).

Note that nvm does not understand semver ranges.`;

/** @type {(contentsStr: string) => ParseResult | ParseError} */
export default function parseNVMRC(contentsStr) {
	const rawOptions = parseRawOptions(contentsStr);
	const optionsEntries = parseOptionsEntries(rawOptions);
	const map = new Map(optionsEntries);

	if (!isValidNVMRC(rawOptions, optionsEntries, map)) {
		return {
			errorMessage: ERROR_MESSAGE,
			rawOptions,
			success: false,
		};
	}

	return {
		options: fromEntries(optionsEntries),
		success: true,
	};
}
