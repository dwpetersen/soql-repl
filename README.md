# SOQL REPL
A SOQL client/library for Salesforce written in Typescript. It's intended to be imported into a node REPL session and used to build and run queries. The results of those queries can be saved to variables and manipulated with standard JS functions.

## Configuration
### Requirements
* Node >16.15.0 (could work on lower versions but not tested)

### Set up
1. Run ```npm install``` to install the dependencies.
2. Create an alias in ```./creds```.
3. Create the settings file ```settings.json```.
   1. Populate ```defaultAlias``` with the name of alias you created.
4. Run ```npm run dev``` to compile the TypeScript to JavaScript. The output will be in ```./dist/```.

## Usage
1. Run ```node``` in the project folder.
2. At the moment there's no way to import the whole module as a library. Look at the file structure in ```./dist/``` and import the respective file as a module
   ```js
   const query = require('./dist/query/query.js');
   ```

## Examples
Here are some example files to run that build and execute a query.
```bash
node examples/bin/query/account.js
```
```bash
node examples/bin/query/opportunity.js
```