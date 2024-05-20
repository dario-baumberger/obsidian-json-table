export const testCaseEmpty = {
	md: "",
	json: []
};

export const testCaseHeaderOnly = {
	md: "| Test1 | Test2 |",
	json: []
};

export const testCaseNoTableBody = {
	md: "| Test1 | Test2 |\n| --- | --- |",
	json: []
};

export const testCaseSmallTable = {
	md: `| Test1 | Test2 |\n| --- | --- |\n| Value 1 | Value 2 |`,
	json: [{Test1: "Value 1", Test2: "Value 2"}]
};

export const testCaseTableLarge = {
	md: `| Test1 | Test2 | Test3 | Test4 |\n| --- | --- | --- | --- |\n| Value 1.1 | Value 1.2 | Value 1.3 | Value 1.4 |\n| Value 2.1 | Value 2.2 | Value 2.3 | |\n| Value 3.1 | Value 3.2 | | Value 3.4 |`,
	json: [
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
	]
};

export const testCaseTableNDimension = {
	md: `| name | contact.mail | contact.phone |\n| --- | --- | --- |\n| Peter | 1@example.com | foo |`,
	json: [
		{
			name: "Peter",
			contact: {
				mail: "1@example.com",
				phone: "foo"
			}
		}
	]
};

export const noBodyTable = `| Test1 | Test |\n| --- | --- |`;
export const testTable = `| Test1 | Test2 |\n| --- | --- |\n| Value 1 | Value 2 |`;

export const testJson = [{Test1: "Value 1", Test2: "Value 2"}];
export const testTableLarge = `| Test1 | Test2 | Test3 | Test4 |\n| --- | --- | --- | --- |\n| Value 1.1 | Value 1.2 | Value 1.3 | Value 1.4 |\n| Value 2.1 | Value 2.2 | Value 2.3 | |\n| Value 3.1 | Value 3.2 | | Value 3.4 |`;

export const testJsonLarge = [
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

export const testTableNDimension = `| name | contact.mail | contact.phone.private | contact.phone.work | food[0].type | food[0].menus[0] | food[0].menus[1] | food[1].type | food[1].menus[0] | food[1].menus[1] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Jean | j@example.com | privatePhone | workPhone | Italian | Pizza | Pasta | Greek | Tzatziki | |
| Lorem | k@example.com | mobilePhone | fixedPhone | Swiss | Fondue | | French | Bouillabaisse | Ratatouille |`;

export const testJsonNDimension = [
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

export const testStringArray = [
	"| Test1 | Test2 |",
	"| --- | --- |",
	"| Value 1 | Value 2 |"
];

export const testStringArrayLarge = [
	"| Test1 | Test2 | Test3 | Test4 |",
	"| --- | --- | --- | --- |",
	"| Value 1.1 | Value 1.2 | Value 1.3 | Value 1.4 |",
	"| Value 2.1 | Value 2.2 | Value 2.3 | |",
	"| Value 3.1 | Value 3.2 | | Value 3.4 |"
];

export const keys = ["key1", "key2", "key3"];

export const sameKeys = [
	{key1: 1.1, key2: 1.2, key3: 1.3},
	{key1: 2.1, key2: 2.2, key3: 2.3}
];

export const mixedKeysSingle = [{key1: 1.1}, {key2: 2.2}, {key3: 3.3}];

export const mixedKeys = [
	{key1: 1.1, key2: 1.2},
	{key2: 2.2, key3: 2.3},
	{key1: 3.1, key2: 3.2, key3: 3.3}
];
