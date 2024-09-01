import {getRowContent, parseHeader} from "./md.utils";

/**
 * Checks if the input is an object and not null
 *
 * @param {unknown} input
 * @returns {boolean}
 */
function isObject(input: unknown): boolean {
	return typeof input === "object" && input !== null;
}

/**
 * Handles the case where the value is an array
 *
 * @param {unknown[]} value
 * @param {string} key
 * @param {string} prefix
 * @returns {Record<string, unknown>}
 */
function handleArray(
	value: unknown[],
	key: string,
	prefix: string
): Record<string, unknown> {
	const flatObject: Record<string, unknown> = {};
	value.forEach((item, index) => {
		if (isObject(item)) {
			Object.assign(
				flatObject,
				flattenStructure(item, `${prefix}${key}[${index}].`)
			);
		} else if (item !== undefined) {
			flatObject[`${prefix}${key}[${index}]`] = item;
		}
	});
	return flatObject;
}

/**
 * Handles the case where the value is not an array
 *
 * @param {unknown} value
 * @param {string} key
 * @param {string} prefix
 * @returns {Record<string, unknown>}
 */
function handleValue(
	value: unknown,
	key: string,
	prefix: string
): Record<string, unknown> {
	const flatObject: Record<string, unknown> = {};
	const newKey = `${prefix}${key}`;
	if (isObject(value)) {
		Object.assign(flatObject, flattenStructure(value, `${newKey}.`));
	} else if (value !== undefined) {
		flatObject[newKey] = value;
	}
	return flatObject;
}

/**
 * Flattens the structure of a JSON object
 *
 * @param {Object} input
 * @param {string} prefix
 * @returns {Object}
 */
export function flattenStructure(
	input: unknown,
	prefix: string = ""
): Record<string, unknown> {
	const flatObject: Record<string, unknown> = {};

	if (!isObject(input)) {
		return flatObject;
	}

	for (const key in input as Record<string, unknown>) {
		const value = (input as Record<string, unknown>)[key];
		if (Array.isArray(value)) {
			Object.assign(flatObject, handleArray(value, key, prefix));
		} else {
			Object.assign(flatObject, handleValue(value, key, prefix));
		}
	}
	return flatObject;
}

/**
 * Handles the flattening of an object or array item.
 *
 * @param {unknown} item - The item to be flattened.
 * @param {string} key - The key associated with the item.
 * @param {Record<string, unknown>} flatObject - The object that accumulates the flattened structure.
 * @param {string} prefix - The current prefix for the key.
 */
export function handleObject(
	item: unknown,
	key: string,
	flatObject: Record<string, unknown>,
	prefix: string
) {
	if (typeof item === "object" && item !== null) {
		return Object.assign(
			flatObject,
			flattenStructure(item, `${prefix}${key}.`)
		);
	} else {
		return (flatObject[`${prefix}${key}`] = item);
	}
}

/**
 * Search all keys in JSON and return as string array
 *
 * @param {Array} input
 * @returns {string[]}
 */
export function collectAllKeys(input: unknown[]): string[] {
	const keys: string[] = [];

	for (const obj of input) {
		const jsonObject = flattenStructure(obj as {[key: string]: never});
		for (const key in jsonObject) {
			if (jsonObject.hasOwnProperty(key) && !keys.includes(key)) {
				keys.push(key);
			}
		}
	}

	return keys;
}

/**
 * This function is used to get a nested object from a given object based on a list of keys.
 * It also handles the case where the nested object is inside an array.
 *
 * @param rowObject - The object from which to get the nested object.
 * @param keys - An array of keys representing the path to the nested object.
 * @param isArray - An array of booleans indicating whether the corresponding key in the keys array is an array.
 * @param indices - An array of indices corresponding to the keys that are arrays.
 * @returns - The nested object if it exists, otherwise it returns the original object.
 */
export function getNestedObject(
	rowObject: Record<string, unknown>,
	keys: string[],
	isArray: boolean[],
	indices: number[]
): Record<string, unknown> | unknown[] {
	let current: Record<string, unknown> | unknown[] = rowObject;
	// Loop through the keys
	for (let j = 0; j < keys.length - 1; j++) {
		const key = keys[j].replace(/\[\d+\]/, ""); // replace array index
		// If the key is an array
		if (isArray[j]) {
			// If the current key is not an array, initialize it as an array
			if (!Array.isArray(current[key])) {
				current[key] = [];
			}
			// If an index is provided for the array
			if (indices[j] !== undefined) {
				const arrayCurrent = current[key] as unknown[];
				// If the current index is not an object, initialize it as an object
				if (
					typeof arrayCurrent[indices[j]] !== "object" ||
					arrayCurrent[indices[j]] === null
				) {
					arrayCurrent[indices[j]] = {};
				}
				// Move the current pointer to the object at the current index
				current = arrayCurrent[indices[j]] as Record<string, unknown>;
			}
		} else {
			// If the current key is not an object, initialize it as an object
			if (typeof current[key] !== "object" || current[key] === null) {
				current[key] = {};
			}
			// Move the current pointer to the object at the current key
			current = current[key] as Record<string, unknown>;
		}
	}
	// Return the nested object
	return current;
}

export function convertToPrimitive(
	input: string | boolean | number | string | null | undefined
): boolean | number | string | null | undefined {
	const check = `${input}`.toLowerCase();

	if (check === "true") {
		return true;
	} else if (check === "false") {
		return false;
	} else if (check === "null") {
		return null;
	} else if (check === "undefined") {
		return undefined;
	} else if (check === "") {
		return undefined;
	} else if (check === "0") {
		return 0;
	} else if (check.startsWith("0")) {
		return input;
	} else if (!isNaN(Number(input))) {
		return Number(input);
	} else {
		return input;
	}
}

export function processRow(
	row: string,
	parsedHeaders: ReturnType<typeof parseHeader>[]
): Record<string, unknown> {
	const rowData = getRowContent(row);
	const rowObject: Record<string, unknown> = {};

	for (let i = 0; i < parsedHeaders.length; i++) {
		processCell(rowData[i], parsedHeaders[i], rowObject);
	}

	return rowObject;
}

export function processCell(
	value: string | number | null | undefined | boolean,
	header: ReturnType<typeof parseHeader>,
	rowObject: Record<string, unknown>
) {
	value = convertToPrimitive(value);

	if (value === undefined || value === "") {
		return;
	}

	const {keys, isArray, indices} = header;
	const key = keys[keys.length - 1].replace(/\[\d+\]/, "");

	const current = getNestedObject(
		rowObject,
		keys,
		isArray,
		indices
	) as Record<string, unknown>;

	if (isArray[keys.length - 1]) {
		if (!Array.isArray(current[key])) {
			(current[key] as unknown[]) = [];
		}
		(current[key] as unknown[])[indices[keys.length - 1]] = value;
	} else {
		current[key] = value;
	}
}
