import ljharb from '@ljharb/eslint-config/flat/node/20';

export default [
	...ljharb,
	{
		rules: {
			'func-style': 'off',
			'no-console': 'off',
			'no-extra-parens': 'off',
			'no-process-exit': 'off',
		},
	},
];
