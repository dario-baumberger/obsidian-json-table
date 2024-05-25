// table and json test data
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
	json: [{Test1: "Value 1", Test2: "Value 2"}],
	lines: ["| Test1 | Test2 |", "| --- | --- |", "| Value 1 | Value 2 |"]
};

export const testCaseLarge = {
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
			Test3: "Value 2.3"
		},
		{
			Test1: "Value 3.1",
			Test2: "Value 3.2",
			Test4: "Value 3.4"
		}
	],
	lines: [
		"| Test1 | Test2 | Test3 | Test4 |",
		"| --- | --- | --- | --- |",
		"| Value 1.1 | Value 1.2 | Value 1.3 | Value 1.4 |",
		"| Value 2.1 | Value 2.2 | Value 2.3 | |",
		"| Value 3.1 | Value 3.2 | | Value 3.4 |"
	]
};

export const testCaseNDimensionSimple = {
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

export const testCaseNDimensionMedium = {
	md: `| name | contact.mail | contact.phone.private | contact.phone.work | food[0].type | food[0].menus[0] | food[0].menus[1] | food[1].type | food[1].menus[0] | food[1].menus[1] |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n| Jean | j@example.com | privatePhone | workPhone | Italian | Pizza | Pasta | Greek | Tzatziki | |\n| Lorem | k@example.com | mobilePhone | fixedPhone | Swiss | Fondue | | French | Bouillabaisse | Ratatouille |`,
	json: [
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
	],
	lines: [
		"| name | contact.mail | contact.phone.private | contact.phone.work | food[0].type | food[0].menus[0] | food[0].menus[1] | food[1].type | food[1].menus[0] | food[1].menus[1] |",
		"| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
		"| Jean | j@example.com | privatePhone | workPhone | Italian | Pizza | Pasta | Greek | Tzatziki | |",
		"| Lorem | k@example.com | mobilePhone | fixedPhone | Swiss | Fondue | | French | Bouillabaisse | Ratatouille |"
	]
};

export const testCaseNDimensionComplex = {
	md: `| name | age | contact.email | contact.phone | skills[0] | skills[1] | education.degree | education.school | projects[0].name | projects[0].duration | projects[0].technologies[0] | projects[0].technologies[1] | projects[1].name | projects[1].duration | projects[1].technologies[0] | projects[1].technologies[1] | active | balance |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n| John Doe | 30 | john@example.com | 1234567890 | JavaScript | TypeScript | Computer Science | XYZ University | Project 1 | 0 | React | Redux | Project 2 | 12 | Node.js | MongoDB | true | -100 |\n| Jane Doe | | jane@example.com | 0987654321 | Python | Data Analysis | Data Science | ABC University | Project A | 3 | Pandas | NumPy | Project B | 8 | Scikit-learn | TensorFlow | false | 200 |\n| Bob Smith | 35 | bob@example.com | | Java | | | | Project X | 10 | Spring Boot | | | | | | true | -50 |`,
	json: [
		{
			name: "John Doe",
			age: 30,
			contact: {
				email: "john@example.com",
				phone: 1234567890
			},
			skills: ["JavaScript", "TypeScript"],
			education: {
				degree: "Computer Science",
				school: "XYZ University"
			},
			projects: [
				{
					name: "Project 1",
					duration: 0,
					technologies: ["React", "Redux"]
				},
				{
					name: "Project 2",
					duration: 12,
					technologies: ["Node.js", "MongoDB"]
				}
			],
			active: true,
			balance: -100
		},
		{
			name: "Jane Doe",
			contact: {
				email: "jane@example.com",
				phone: "0987654321"
			},
			skills: ["Python", "Data Analysis"],
			education: {
				degree: "Data Science",
				school: "ABC University"
			},
			projects: [
				{
					name: "Project A",
					duration: 3,
					technologies: ["Pandas", "NumPy"]
				},
				{
					name: "Project B",
					duration: 8,
					technologies: ["Scikit-learn", "TensorFlow"]
				}
			],
			active: false,
			balance: 200
		},
		{
			name: "Bob Smith",
			age: 35,
			contact: {
				email: "bob@example.com"
			},
			skills: ["Java"],
			projects: [
				{
					name: "Project X",
					duration: 10,
					technologies: ["Spring Boot"]
				}
			],
			active: true,
			balance: -50
		}
	],
	lines: [
		"| name | age | contact.email | contact.phone | skills[0] | skills[1] | education.degree | education.school | projects[0].name | projects[0].duration | projects[0].technologies[0] | projects[0].technologies[1] | projects[1].name | projects[1].duration | projects[1].technologies[0] | projects[1].technologies[1] | active | balance |",
		"| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
		"| John Doe | 30 | john@example.com | 1234567890 | JavaScript | TypeScript | Computer Science | XYZ University | Project 1 | 0 | React | Redux | Project 2 | 12 | Node.js | MongoDB | true | -100 |",
		"| Jane Doe | | jane@example.com | 0987654321 | Python | Data Analysis | Data Science | ABC University | Project A | 3 | Pandas | NumPy | Project B | 8 | Scikit-learn | TensorFlow | false | 200 |",
		"| Bob Smith | 35 | bob@example.com | | Java | | | | Project X | 10 | Spring Boot | | | | | | true | -50 |"
	]
};
