import {TableColumn} from './types';

const FILLABLE_IGNORE:Array<RegExp> = [/password/,/token/,/_at$/,/admin/,/^is_/];
const CAST_IGNORE_NAMES:Array<String> = ["created_at","updated_at","deleted_at"];
const CAST_TYPES:Map<String,String> = new Map([
    ["timestamp","datetime"],
    ["tinyint(1)","boolean"],
    ["json","array"]
]);

export default function generateCode(schema:Array<TableColumn>):string {
    let traits:Array<String> = [];
    let protectedVariables:Array<String> = [];
    let fillable:Array<String> = [];
    let casts:Map<String,String> = new Map<String,String>();

    // Look for primary key
    const primaryKeyCol = schema.find((col) => col.primaryKey);
    if (primaryKeyCol !== undefined) {

        if (primaryKeyCol.type.includes("char")) {
            traits.push('\\Illuminate\\Database\\Eloquent\\Concerns\\HasUuids');
        }
        
        if (primaryKeyCol.name!=="id") {
            protectedVariables.push(`protected $primaryKey = '${primaryKeyCol.name}';`);
        }

        if (primaryKeyCol.autoIncrement===false) {
            protectedVariables.push('public $incrementing = false;');
        }

        if (!primaryKeyCol.type.includes("int")) {
            protectedVariables.push("protected $keyType = 'string';");
        }
    }

    // Look for soft deletes
    const deleteAtCol = schema.find((col) => col.name==="deleted_at");
    if (deleteAtCol) {
        traits.push("\\Illuminate\\Database\\Eloquent\\SoftDeletes");
    }

    schema.forEach(function(column) {
        if (column.primaryKey || column.autoIncrement || column.foreignKey) {
            return;
        }
        // Look for the ignore regex in names
        let ignore:boolean = false;
        for(let i=0;i<FILLABLE_IGNORE.length;i++) {
            if (FILLABLE_IGNORE[i].test(column.name)) {
                ignore = true;
                break;
            }
        }
        if (!ignore) {
            fillable.push(column.name);
        }
    });

    schema.forEach(function(column) {
        if (CAST_TYPES.has(column.type)) {
            if (CAST_IGNORE_NAMES.find((name) => column.name===name) === undefined) {
                casts.set(column.name,CAST_TYPES.get(column.type) ?? "");
            }
        }
    });


    let code:Array<String> = [];
    if (traits.length>0) {
        code.push("use " + traits.join(", ")+";", "");
    }
    protectedVariables.forEach((value) => {
        code.push(value,"");
    });
    if (fillable.length>0) {
        code.push("protected $fillable = [");
        const fillableVariables = fillable.map((value) =>  "\t'" + value + "'" ).join(",\n");
        code.push(fillableVariables);
        code.push("];","");
    }
    if (casts.size>0) {
        code.push("protected $casts = [");
        casts.forEach((value,key) => {
            code.push("\t'"+ key + "' => '"+ value +"',");
        });
        code.push("];","");
    }
    
    return code.join("\n");
}