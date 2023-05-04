// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import getTableSchema from './db/mysql';
import getDatabaseInformation from './laravel';
import generateCode from './eloquent';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


	const disposable = vscode.commands.registerTextEditorCommand('laravel-eloquent-model-attributes.insert-attributes', (editor, edit) => {
		getDatabaseInformation().then((dbInfo) => {
			if (dbInfo !== undefined) {
				vscode.window.showInputBox({
					prompt:"Enter your table name"
				}).then((tableName) => {
					if (tableName!==undefined) {
						getTableSchema(dbInfo,tableName).then((schema) => {
							const newCode = generateCode(schema);
							editor.edit((edit) => {
								edit.replace(editor.selection, newCode);
							});
						}).catch((error) => {
							vscode.window.showErrorMessage(error.message);
						});		
					}
				});
	
			}
		});
	});


	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
