import {jsonToTable, tableToJson} from "src/functions";
import {Editor, Notice, Plugin} from "obsidian";
import {JsonTablePluginSettingTab} from "src/settings";

interface JsonTablePluginSettings {
	devMode: boolean;
}

const DEFAULT_SETTINGS: JsonTablePluginSettings = {
	devMode: false
};

export default class JsonTablePlugin extends Plugin {
	settings: JsonTablePluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "generate-table-from-selected-json",
			name: "Generate table from selected JSON",
			editorCallback: (editor: Editor) => {
				if (this.settings.devMode) {
					console.log("JSON Table Selection:", editor.getSelection());
				}
				try {
					editor.replaceSelection(jsonToTable(editor.getSelection()));
				} catch (error) {
					console.error(error);
					new Notice(error);
				}
			}
		});

		this.addCommand({
			id: "generate-table-from-selected-json-url",
			name: "Generate table from selected JSON URL",
			editorCallback: async (editor: Editor) => {
				const selection = editor.getSelection();
				const response = await fetch(selection);

				if (!response.ok) {
					console.error(response.statusText);
					new Notice(response.statusText);
				}

				const json = await response.json();

				editor.replaceSelection(jsonToTable(JSON.stringify(json)));

				if (this.settings.devMode) {
					console.log("JSON Table fetch response:", json);
				}
			}
		});

		this.addCommand({
			id: "generate-json-from-selected-table",
			name: "Generate JSON from selected table",
			editorCallback: (editor: Editor) => {
				if (this.settings.devMode) {
					console.log("JSON Table Selection:", editor.getSelection());
				}
				try {
					editor.replaceSelection(
						JSON.stringify(tableToJson(editor.getSelection()))
					);
				} catch (error) {
					console.error(error);
					new Notice(error);
				}
			}
		});

		this.addSettingTab(new JsonTablePluginSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
