import ljharb from '@ljharb/eslint-config/flat/node/20';

export default [
	...ljharb,
	{
		rules: {
			'array-bracket-newline': 'off',
			'func-style': 'off',
			'no-console': 'off',
			'no-extra-parens': 'off',
			'no-process-exit': 'off',
			'prefer-named-capture-group': 'off',
		},
	},
];
