import {expect, test} from "vitest";
import {jsonToTable, tableToJson} from "../src/functions";
import {describe} from "node:test";

import {
	testCaseEmpty,
	testCaseHeaderOnly,
	testCaseNoTableBody,
	testCaseSmallTable,
	testCaseTableLarge,
	testCaseTableNDimension
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
		expect(tableToJson(testCaseTableLarge.md)).toEqual(
			testCaseTableLarge.json
		);
	});

	test("Table n dimensions small", () => {
		expect(tableToJson(testCaseTableNDimension.md)).toStrictEqual(
			testCaseTableNDimension.json
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

	test("testCaseTableLarge", () => {
		expect(
			jsonToTable(JSON.stringify(testCaseTableLarge.json))
		).toStrictEqual(testCaseTableLarge.md);
	});

	test("testNDimension", () => {
		expect(
			jsonToTable(JSON.stringify(testCaseTableNDimension.json))
		).toStrictEqual(testCaseTableNDimension.md);
	});
});
