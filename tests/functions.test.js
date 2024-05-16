import {expect, test} from "vitest";
import {
	jsonToTable,
	tableToJson,
	trimSeperatorSpaces,
	collectAllKeys,
	flattenStructure
} from "../src/functions";
import {describe} from "node:test";

const noBodyTable = `| Test1 | Test |\n| --- | --- |`;
const testTable = `| Test1 | Test2 |\n| --- | --- |\n| Value 1 | Value 2 |`;
const testJson = [{Test1: "Value 1", Test2: "Value 2"}];
const testTableLarge = `| Test1 | Test2 | Test3 | Test4 |\n| --- | --- | --- | --- |\n| Value 1.1 | Value 1.2 | Value 1.3 | Value 1.4 |\n| Value 2.1 | Value 2.2 | Value 2.3 | |\n| Value 3.1 | Value 3.2 | | Value 3.4 |`;
const testJsonLarge = [
	{
		Test1: "Value 1.1",
		Test2: "Value 1.2",
		Test3: "Value 1.3",
		Test4: "Value 1.4"
	},
	{
		Test1: "Value 2.1",
		Test2: "Value 2.2",
		Test3: "Value 2.3",
		Test4: ""
	},
	{
		Test1: "Value 3.1",
		Test2: "Value 3.2",
		Test3: "",
		Test4: "Value 3.4"
	}
];

const testTableNDimension = `| name | contact.mail | contact.phone.private | contact.phone.work | food[0].type | food[0].menus[0] | food[0].menus[1] | food[1].type | food[1].menus[0] | food[1].menus[1] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Jean | j@example.com | privatePhone | workPhone | Italian | Pizza | Pasta | Greek | Tzatziki | |
| Lorem | k@example.com | mobilePhone | fixedPhone | Swiss | Fondue | | French | Bouillabaisse | Ratatouille |`;
const testJsonNDimension = [
	{
		name: "Jean",
		contact: {
			mail: "j@example.com",
			phone: {
				private: "privatePhone",
				work: "workPhone"
			}
		},
		food: [
			{
				type: "Italian",
				menus: ["Pizza", "Pasta"]
			},
			{
				type: "Greek",
				menus: ["Tzatziki"]
			}
		]
	},
	{
		name: "Lorem",
		contact: {
			mail: "k@example.com",
			phone: {
				private: "mobilePhone",
				work: "fixedPhone"
			}
		},
		food: [
			{
				type: "Swiss",
				menus: ["Fondue"]
			},
			{
				type: "French",
				menus: ["Bouillabaisse", "Ratatouille"]
			}
		]
	}
];

const keys = ["key1", "key2", "key3"];
const sameKeys = [
	{key1: 1.1, key2: 1.2, key3: 1.3},
	{key1: 2.1, key2: 2.2, key3: 2.3}
];
const mixedKeysSingle = [{key1: 1.1}, {key2: 2.2}, {key3: 3.3}];

const mixedKeys = [
	{key1: 1.1, key2: 1.2},
	{key2: 2.2, key3: 2.3},
	{key1: 3.1, key2: 3.2, key3: 3.3}
];

describe("trimSeperatorSpaces", () => {
	describe("Single", () => {
		test("Empty", () => {
			expect("").toStrictEqual("");
		});

		test("No Space", () => {
			expect(trimSeperatorSpaces("|Test|")).toStrictEqual("|Test|");
		});

		test("All 1 Space", () => {
			expect(trimSeperatorSpaces(" | Test | ")).toStrictEqual("|Test|");
		});

		test("All 2 Spaces", () => {
			expect(trimSeperatorSpaces("  |  Test  |  ")).toStrictEqual(
				"|Test|"
			);
		});

		test("Random Spaces", () => {
			expect(trimSeperatorSpaces("|  Test   |   ")).toStrictEqual(
				"|Test|"
			);
		});
	});

	describe("Multiple", () => {
		test("No Space", () => {
			expect(trimSeperatorSpaces("|Test|Test|Test|")).toStrictEqual(
				"|Test|Test|Test|"
			);
		});

		test("Random Spaces", () => {
			expect(
				trimSeperatorSpaces("|  Test   | Test| Test|  ")
			).toStrictEqual("|Test|Test|Test|");
		});
	});
});

describe("tableToJson", () => {
	test("empty input", () => {
		expect(tableToJson("")).toStrictEqual([]);
	});

	test("only header", () => {
		expect(tableToJson("|Test1|Test2|")).toStrictEqual([]);
	});

	test("no table body", () => {
		expect(tableToJson(noBodyTable)).toStrictEqual([]);
	});

	test("Complete table", () => {
		expect(tableToJson(testTable)).toEqual(testJson);
	});

	test("Complete table large", () => {
		expect(tableToJson(testTableLarge)).toEqual(testJsonLarge);
	});
});

describe("jsonToTable", () => {
	test("empty input", () => {
		expect(jsonToTable(JSON.stringify([]))).toStrictEqual("");
	});

	test("small", () => {
		expect(jsonToTable(JSON.stringify(testJson))).toStrictEqual(testTable);
	});

	test("testTableLarge", () => {
		expect(jsonToTable(JSON.stringify(testJsonLarge))).toStrictEqual(
			testTableLarge
		);
	});

	test("testNDimension", () => {
		console.log(jsonToTable(JSON.stringify(testJsonNDimension)));
		console.log(testTableNDimension);

		expect(jsonToTable(JSON.stringify(testJsonNDimension))).toStrictEqual(
			testTableNDimension
		);
	});
});

describe("collectAllKeys", () => {
	test("sameKeys", () => {
		expect(collectAllKeys(sameKeys)).toStrictEqual(keys);
	});

	test("mixedKeysSingle", () => {
		expect(collectAllKeys(mixedKeysSingle)).toStrictEqual(keys);
	});

	test("mixedKeys", () => {
		expect(collectAllKeys(mixedKeys)).toStrictEqual(keys);
	});
});

describe("flattenStructure", () => {
	test("empty object", () => {
		expect(flattenStructure({})).toStrictEqual({});
	});

	test("empty array", () => {
		expect(flattenStructure([])).toStrictEqual({});
	});

	test("smallObject", () => {
		expect(
			flattenStructure({
				name: "Peter",
				contact: {
					mail: "1@example.com",
					phone: "foo"
				}
			})
		).toStrictEqual({
			"contact.mail": "1@example.com",
			"contact.phone": "foo",
			name: "Peter"
		});
	});

	test("smallArray", () => {
		expect(
			flattenStructure({
				name: "Max",
				contact: ["123456789", "2@example.com", "bar"]
			})
		).toStrictEqual({
			"contact[0]": "123456789",
			"contact[1]": "2@example.com",
			"contact[2]": "bar",
			name: "Max"
		});
	});

	test("smallObject2", () => {
		expect(
			flattenStructure({
				name: "Jana",
				contact: {
					mail: "3@example.com",
					phone: "blah"
				},
				food: ["Pizza", "Pasta"]
			})
		).toStrictEqual({
			"contact.mail": "3@example.com",
			"contact.phone": "blah",
			name: "Jana",
			"food[0]": "Pizza",
			"food[1]": "Pasta"
		});
	});

	test("smallArray", () => {
		expect(
			flattenStructure({
				name: "Muster",
				contact: [
					["1@mail.com", "2@mail.com"],
					["123456789", "987654321"],
					["blah"],
					[]
				]
			})
		).toStrictEqual({
			"contact[0].0": "1@mail.com",
			"contact[0].1": "2@mail.com",
			"contact[1].0": "123456789",
			"contact[1].1": "987654321",
			"contact[2].0": "blah",
			name: "Muster"
		});
	});

	test("mixed", () => {
		expect(
			flattenStructure({
				name: "Jean",
				contact: {
					mail: "j@example.com",
					phone: {
						private: "privatePhone",
						work: "workPhone"
					}
				},
				food: [
					{
						type: "Italian",
						menus: ["Pizza", "Pasta"]
					},
					{
						type: "Greek",
						menus: ["Souvlaki", "Tzatziki"]
					}
				]
			})
		).toStrictEqual({
			"contact.mail": "j@example.com",
			"contact.phone.private": "privatePhone",
			"contact.phone.work": "workPhone",
			"food[0].menus[0]": "Pizza",
			"food[0].menus[1]": "Pasta",
			"food[0].type": "Italian",
			"food[1].menus[0]": "Souvlaki",
			"food[1].menus[1]": "Tzatziki",
			"food[1].type": "Greek",
			name: "Jean"
		});
	});
});
