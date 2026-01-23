export interface ParseResult {
	options: Record<string, string>;
	success: true;
}

export interface ParseError {
	errorMessage: string;
	rawOptions: string[];
	success: false;
}

export function isValidNVMRC(
	rawOptions: string[],
	optionsEntries: [string, string][],
	map: Map<string, string>,
): boolean;

declare function parseNVMRC(contentsStr: string): ParseResult | ParseError;

export default parseNVMRC;
