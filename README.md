[![Build and Test](https://github.com/dario-baumberger/obsidian-json-table/actions/workflows/build.yml/badge.svg)](https://github.com/dario-baumberger/obsidian-json-table/actions/workflows/build.yml)

# Obsidian JSON to table

Generate tables from a URL (which returns JSON) or a JSON string in your notes. Generate JSON from a table in your notes.

## Commands

| Command                                 | Description                                                                                          |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Generate a table from selected JSON     | Creates a Markdown table based on your selected JSON. The JSON needs to be valid.                    |
| Generate table from a selected JSON URL | Creates a Markdown table based on JSON data from a selected URL. The URL needs to return valid JSON. |
| Generate JSON from a selected table     | Creatse JSON based on your selected table.                                                           |

### Examples

#### Table

```
| Name | Age | City   |
| ---- | --- | ------ |
| Doe  | 22  | Berlin |
| Pan  | 34  | Mumbai |
```

#### JSON:

```
[{"Name":"Doe","Age":"22","City":"Berlin"},{"Name":"Pan","Age":"34","City":"Mumbai"}]
```

#### URL

-   `https://raw.githubusercontent.com/dario-baumberger/obsidian-json-table/master/demo/example.json`
-   `https://jsonplaceholder.typicode.com/todos`

## Installation

### Community Plugin

The Plugin was not release yes. You need to install it manually.

### Manually installing the plugin

-   Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/obsidian-json-to-table/`.

## Contribution

-   Feel free to open an issue if you miss something
-   Feel free to open a Pull request to implement a feature
    -   Please extend tests if you ad logic
