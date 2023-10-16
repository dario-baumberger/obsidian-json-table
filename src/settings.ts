import JsonTablePlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class JsonTablePluginSettingTab extends PluginSettingTab {
	plugin: JsonTablePlugin;

	constructor(app: App, plugin: JsonTablePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h1", {
			text: "JSON Table - Settings",
		});

		containerEl.createEl("h2", {
			text: "Commands",
		});

		new Setting(containerEl)
			.setName("Translate selection")
			.setDesc(
				'Translates the selected text from the "From language" to the "To language".'
			);

		new Setting(containerEl)
			.setName("Translate selection")
			.setDesc(
				'Translates the selected text from the "From language" to the "To language".'
			);

		new Setting(containerEl)
			.setName("Translate selection")
			.setDesc(
				'Translates the selected text from the "From language" to the "To language".'
			);

		containerEl.createEl("h4", {
			text: "Developper Settings",
		});
		new Setting(containerEl)
			.setName("Enable Debug Logging")
			.setDesc("If enabled")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.devMode)
					.onChange(async (value) => {
						this.plugin.settings.devMode = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
