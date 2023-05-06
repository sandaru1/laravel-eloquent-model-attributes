import * as vscode from 'vscode';
import { TableColumn } from './types';

export default function generateDoc(schema: Array<TableColumn>): string {
    const configuration = vscode.workspace.getConfiguration("laravel-eloquent-model-attributes");

    let code: Array<String> = [];
    code.push("/**");

    schema.forEach(function (column) {
        let selectedType = column.type;
        for (const type in configuration.PHPDoc.types) {
            if (new RegExp(type).test(column.type)) {
                selectedType = configuration.PHPDoc.types[type];
                break;
            }
        }
        code.push(" * @property " + selectedType + " \\$" + column.name + " ");
    });

    code.push(" */");

    return code.join("\n");
}