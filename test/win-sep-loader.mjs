/** @type {(specifier: string, context: unknown, next: (specifier: string, context: unknown) => unknown) => unknown} */
export function resolve(specifier, context, next) {
	if (specifier === 'path') {
		return { shortCircuit: true, url: 'virtual:win-path-shim' };
	}
	return next(specifier, context);
}

/** @type {(url: string, context: unknown, next: (url: string, context: unknown) => unknown) => unknown} */
export function load(url, context, next) {
	if (url === 'virtual:win-path-shim') {
		return {
			shortCircuit: true,
			format: 'module',
			source: "export * from 'node:path';\nexport const sep = '\\\\';\n",
		};
	}
	return next(url, context);
}
