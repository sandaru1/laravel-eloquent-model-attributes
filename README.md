# README

This extension can query your database tables and insert the relevant eloquent model attributes such as $fillable, $casts, etc.

## Features

Use the Command Palette to excute "Insert Eloquent Model Attributes" in your model file. The extension will automatically get your database information and asks you to input the table name.

![Screenshot](https://raw.githubusercontent.com/sandaru1/laravel-eloquent-model-attributes/main/images/attributes.gif)

This extension can detect and insert following attribute changes. You can change these in the extension settings.

#### Primary Key

1. Different primary key name other than `id`.
2. Checks if the auto increment is turned off.
3. Checks if the primary is a UUID and adds `HasUuids` trait.

#### Soft Deletes

1. If the table is using soft deletes, `SoftDeletes` trait will be added.

#### Fillables

1. The primary key will be ignored.
2. The foreign keys will be ignored.
3. Auto incrementing columns will be ignored.
4. Any columns with the text `password`, `token`, or `admin` in the name will be ignored.
5. Any columns ending in `_at` will be ignored.
6. Any columns starting with `is_` will be ignored.
6. Everything else is addeed to the `$fillable` array.

#### Attribute Casting

1. `created_at`, `updated_at` and `deleted_at` are not casted.
2. `timestamp` is casted to `datetime`.
3. `tinyint` is casted to `boolean`.
4. `json` is casted to `array`.

## Extension Settings

![Screenshot](https://raw.githubusercontent.com/sandaru1/laravel-eloquent-model-attributes/main/images/settings.png)

## Known Issues

1. When the attributes are inserted into the code editor, indentation fails.
2. Only supports MySQL at the moment.

## Release Notes

### 0.0.2

Configuration options.

### 0.0.1

Initial release of Laravel Eloquent Model Attributes.

