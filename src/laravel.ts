import * as vscode from 'vscode';
import * as dotenv from 'dotenv';

import {DatabaseInformation,DatabaseType} from './types';

export default async function getDatabaseInformation() : Promise<DatabaseInformation|undefined> {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders === undefined) {
		vscode.window.showErrorMessage("Open your laravel root directory in the workspace to continue.");
	} else {
		let activeFolder:vscode.WorkspaceFolder|undefined;
		if (workspaceFolders.length ===1) {
			activeFolder = workspaceFolders[0];
		} else {
			activeFolder = await vscode.window.showWorkspaceFolderPick();
		}
		if (activeFolder !== undefined) {
			let envPath = activeFolder.uri.path+"/.env";
			if(process.platform == 'win32'){
				envPath = activeFolder.uri.path.substring(1) + "/.env";
			}
			const config = dotenv.config({path: envPath});
			if (config.parsed) {
				if (config.parsed.DB_CONNECTION!=="mysql") {
					vscode.window.showErrorMessage("This extension only supports MySQL databases.");
				} else {
					const dbInfo:DatabaseInformation = {
						type: DatabaseType.mySQL,
						host: config.parsed.DB_HOST,
						port: parseInt(config.parsed.DB_PORT),
						username: config.parsed.DB_USERNAME,
						password: config.parsed.DB_PASSWORD,
						database: config.parsed.DB_DATABASE
					};
					return dbInfo;	
				}
			} else {
				vscode.window.showErrorMessage("An error occured while trying to parse the .env file.\n"+config.error?.message ?? "");
			}
		}
	}
	return undefined;
}

export function detectModelName(document: vscode.TextDocument):string|null {
	const code = document.getText();
	const matches = code.match(/class\s+([a-zA-Z_\x80-\xff][a-zA-Z0-9_\x80-\xff]*)\s+extends\s+Model\s+/);
	if (matches !== null) {
		if (matches.length === 2) {	// Exactly one class that extends Model
			return matches[1];
		}
	}
	return null;
}