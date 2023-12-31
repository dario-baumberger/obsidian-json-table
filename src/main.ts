import {jsonToTable, tableToJson} from "src/functions";
import {Editor, Notice, Plugin, requestUrl} from "obsidian";
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
			icon: "table",
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
			icon: "link",
			editorCallback: async (editor: Editor) => {
				const selection = editor.getSelection();

				try {
					const response = await requestUrl(selection);

					editor.replaceSelection(
						jsonToTable(JSON.stringify(response.json))
					);

					if (this.settings.devMode) {
						console.log(
							"JSON Table fetch response:",
							response.json
						);
					}
				} catch (error) {
					console.error(error);
					new Notice(error);
				}
			}
		});

		this.addCommand({
			id: "generate-json-from-selected-table",
			name: "Generate JSON from selected table",
			icon: "file-json",
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
