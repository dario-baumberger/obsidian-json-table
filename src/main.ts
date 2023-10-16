import { jsonToTable, tableToJson } from "src/functions";
import { Editor, Notice, Plugin } from "obsidian";
import { JsonTablePluginSettingTab } from "src/settings";

interface JsonTablePluginSettings {
	devMode: boolean;
}

const DEFAULT_SETTINGS: JsonTablePluginSettings = {
	devMode: false,
};

export default class JsonTablePlugin extends Plugin {
	settings: JsonTablePluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "json-table-convert-selection-to-table",
			name: "Convert selected JSON to table",
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
			},
		});

		this.addCommand({
			id: "json-table-convert-from-url-to-table",
			name: "Convert JSON url to table",
			editorCallback: (editor: Editor) => {
				const selection = editor.getSelection();
				fetch(selection)
					.then((response) => response.json())
					.then((json) => {
						if (this.settings.devMode) {
							console.log("JSON Table fetch response:", json);
						}
						try {
							editor.replaceSelection(
								jsonToTable(JSON.stringify(json))
							);
						} catch (error) {
							console.error(error);
							new Notice(error);
						}
					})
					.catch((error) => {
						console.error(error);
						new Notice(error);
					});
			},
		});

		this.addCommand({
			id: "json-table-convert-selection-to-json",
			name: "Convert selected table to JSON",
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
			},
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
