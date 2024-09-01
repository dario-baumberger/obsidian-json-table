import {expect, test} from "vitest";
import {jsonToTable, tableToJson} from "../src/functions";
import {describe} from "node:test";

import {
	testCaseEmpty,
	testCaseHeaderOnly,
	testCaseLarge,
	testCaseNDimensionComplex,
	testCaseNDimensionMedium,
	testCaseNDimensionSimple,
	testCaseNoTableBody,
	testCaseSmallTable
} from "./test-data";

describe("tableToJson", () => {
	test("empty input", () => {
		expect(tableToJson(testCaseEmpty.md)).toStrictEqual(testCaseEmpty.json);
	});

	test("only header", () => {
		expect(tableToJson(testCaseHeaderOnly.md)).toStrictEqual(
			testCaseHeaderOnly.json
		);
	});

	test("no table body", () => {
		expect(tableToJson(testCaseNoTableBody.md)).toStrictEqual(
			testCaseNoTableBody.json
		);
	});

	test("Complete table", () => {
		expect(tableToJson(testCaseSmallTable.md)).toEqual(
			testCaseSmallTable.json
		);
	});

	test("Complete table large", () => {
		expect(tableToJson(testCaseLarge.md)).toEqual(testCaseLarge.json);
	});

	test("Test testCaseNDimensionSimple", () => {
		expect(tableToJson(testCaseNDimensionSimple.md)).toStrictEqual(
			testCaseNDimensionSimple.json
		);
	});

	test("Test testCaseNDimensionMedium", () => {
		expect(tableToJson(testCaseNDimensionMedium.md)).toStrictEqual(
			testCaseNDimensionMedium.json
		);
	});

	test("Test testCaseNDimensionComplex", () => {
		expect(tableToJson(testCaseNDimensionComplex.md)).toStrictEqual(
			testCaseNDimensionComplex.json
		);
	});
});

describe("jsonToTable", () => {
	test("empty input", () => {
		expect(jsonToTable(JSON.stringify(testCaseEmpty.json))).toStrictEqual(
			testCaseEmpty.md
		);
	});

	test("small", () => {
		expect(
			jsonToTable(JSON.stringify(testCaseSmallTable.json))
		).toStrictEqual(testCaseSmallTable.md);
	});

	test("Test testCaseLarge", () => {
		expect(jsonToTable(JSON.stringify(testCaseLarge.json))).toStrictEqual(
			testCaseLarge.md
		);
	});

	test("Test testCaseNDimensionSimple", () => {
		expect(
			jsonToTable(JSON.stringify(testCaseNDimensionSimple.json))
		).toStrictEqual(testCaseNDimensionSimple.md);
	});

	test("Test testCaseNDimensionMedium", () => {
		expect(
			jsonToTable(JSON.stringify(testCaseNDimensionMedium.json))
		).toStrictEqual(testCaseNDimensionMedium.md);
	});

	test("Test testCaseNDimensionComplex", () => {
		expect(
			jsonToTable(JSON.stringify(testCaseNDimensionComplex.json))
		).toStrictEqual(testCaseNDimensionComplex.md);
	});
});
