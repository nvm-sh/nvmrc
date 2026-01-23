import ljharb from '@ljharb/eslint-config/flat/node/20';

export default [
	...ljharb,
	{
		rules: {
			'no-console': 'off',
			'no-process-exit': 'off',
		},
	},
];
