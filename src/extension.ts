// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import getTableSchema from './db/mysql';
import getDatabaseInformation, { detectModelName } from './laravel';
import generateCode, { getTableNameFromModel } from './eloquent';
import { TableColumn } from './types';
import generateDoc from './phpdoc';

function insertCode(editor:vscode.TextEditor, getCode: (schema:Array<TableColumn>) => string) {
	getDatabaseInformation().then((dbInfo) => {
		if (dbInfo !== undefined) {
			const model = detectModelName(editor.document);
			let assumedTableName = '';
			if (model !== null) {
				assumedTableName = getTableNameFromModel(model);
			}

			vscode.window.showInputBox({
				prompt: "Enter your table name",
				value: assumedTableName
			}).then((tableName) => {
				if (tableName !== undefined) {
					getTableSchema(dbInfo, tableName).then((schema) => {
						editor.insertSnippet(new vscode.SnippetString(getCode(schema)));
					}).catch((error) => {
						vscode.window.showErrorMessage(error.message);
					});
				}
			});

		}
	});
}


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const insertAttributesDisposable = vscode.commands.registerTextEditorCommand('laravel-eloquent-model-attributes.insert-attributes', (editor, edit) => {
		insertCode(editor, generateCode);
	});
	context.subscriptions.push(insertAttributesDisposable);

	const insertPhpDocDisposable = vscode.commands.registerTextEditorCommand('laravel-eloquent-model-attributes.insert-attributes-phpdoc', (editor, edit) => {
		insertCode(editor, generateDoc);
	});
	context.subscriptions.push(insertPhpDocDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
