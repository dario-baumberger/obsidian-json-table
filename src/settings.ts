import JsonTablePlugin from "src/main";
import {App, PluginSettingTab, Setting} from "obsidian";

export class JsonTablePluginSettingTab extends PluginSettingTab {
	plugin: JsonTablePlugin;

	constructor(app: App, plugin: JsonTablePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Enable debug logging")
			.setDesc("If enabled, more will be logged in the console.")
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
