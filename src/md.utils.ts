/**
 * Removes all whitespaces before and after |
 *
 * @param {string} string
 * @returns {string}
 */
export function trimSeperatorSpaces(string: string): string {
	return string.replace(/([^\S\r\n]*[|][^\S\r\n]*)/g, "|");
}

export function getTableLines(content: string): string[] {
	return content
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0);
}

export function getLineContent(line: string): string[] {
	return line
		.slice(1, -1)
		.split("|")
		.map((content) => content.trim());
}

export function parseHeader(header: string): {
	keys: string[];
	isArray: boolean[];
	indices: number[];
} {
	const keys = header.split(".");
	const isArray = keys.map((key) => key.includes("["));
	const indices = keys
		.map((key) => {
			const match = key.match(/\[(\d+)\]/);
			return match ? parseInt(match[1]) : undefined;
		})
		.filter((index) => index !== undefined) as number[]; // Filter out undefined values and convert to number[]
	return {keys, isArray, indices};
}

export function createHeaderRow(headers: string[]): string {
	return removeDuplicateWhitespaces(`| ${headers.join(" | ")} |`);
}

export function createSeparatorRow(headers: string[]): string {
	return removeDuplicateWhitespaces(
		`| ${headers.map(() => "---").join(" | ")} |`
	);
}
export function createDataRow(
	data: {[key: string]: unknown},
	headers: string[]
): string {
	return `| ${headers
		.map((header) => (data[header] !== undefined ? `${data[header]}` : ""))
		.join(" | ")} |`;
}

export function removeDuplicateWhitespaces(row: string): string {
	return row.replace(/( +)/g, " ");
}
