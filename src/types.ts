export enum DatabaseType {
	mySQL
}

export interface DatabaseInformation {
	type:DatabaseType,
	host:string,
	port:number,
	username:string,
	password:string,
	database:string
}

export interface TableColumn {
	name:string,
	type:string,
	nullable:boolean,
	primaryKey:boolean,
	foreignKey:boolean,
	autoIncrement:boolean
}