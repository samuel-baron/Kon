/*

Kon: Uma Framework para desenvolvimento de páginas web Server Side Rendered em TypeScript

A principal ideia do Kon é ser uma framework simples e fácil de usar, com uma curva de aprendizado baixa e que seja fácil de entender.

a utilização deve ser algo como:

import kon from './kon';

const konfig = kon(['index']);

const konponent = konfig.createKonponent('child');

konponent.content = `
	<div>
		<h1>Child</h1>
	</div>
`;

konfig.konponents.index.addChild(konponent);

*/

/* --------------------------------------- Imports --------------------------------------- */
import { Express } from 'express';
import * as path from 'path';
import * as fs from 'fs';

/* --------------------------------------- Debug --------------------------------------- */
const debugMode = false;
const importPath = require.main.path;

/* --------------------------------------- Tipos --------------------------------------- */
type Konponents = { [key: string]: Konponent };
type Options = { folderName: string, indexName?: string };

/* --------------------------------------- Classe Kon --------------------------------------- */
class Kon {
	app: Express;
	options: Options;
	routes: Konponents = {};
	konponents: Konponents = {};

	constructor(app: Express, options: Options) {
		this.app = app;
		this.options = this.initializeOptions(options);
		this.routes = this.initializeRoutes();
		this.konponents = this.initializeKonponents();
	}

	private initializeOptions(options: Options): Options {
		if (debugMode) { console.log(`Initializing options: ${JSON.stringify(options)}`); }

		if (!options.folderName) {
			options.folderName = 'site';
		}

		if (!options.indexName) {
			options.indexName = 'index';
		}

		return options;
	}

	private initializeKonponents(): Konponents {
		const konponents: Konponents = {};

		if (debugMode) { console.log('Initializing konponents'); }

		const recursiveSearch = (folderPath: string) => {
			const files = fs.readdirSync(folderPath);

			for (const file of files) {
				const filePath = path.join(folderPath, file);
				const stats = fs.statSync(filePath);

				if (stats.isDirectory()) {
					recursiveSearch(filePath);
				} else if (file.endsWith('.kon.html')) {
					const konponentName = file.replace('.kon.html', '');
					const konponentContent = fs.readFileSync(filePath, 'utf8');
					konponents[konponentName] = this.createKonponent(konponentName, konponentContent);
				}
			}
		};

		const konponentsFolder = path.join(importPath, this.options.folderName);
		recursiveSearch(konponentsFolder);

		return konponents;
	}

	private initializeRoutes(): Konponents {
		const routes: Konponents = {};

		if (debugMode) { console.log('Initializing routes'); }

		const konponentsFolder = `${importPath}/${this.options.folderName}`;
		const konponentsFiles = fs.readdirSync(konponentsFolder);

		for (const konponentFile of konponentsFiles) {
			if (konponentFile.endsWith('.html')) {
				const routeName = konponentFile.replace('.html', '');
				const routeContent = fs.readFileSync(`${konponentsFolder}/${konponentFile}`, 'utf8');
				routes[routeName] = this.createKonponent(routeName, routeContent);

				if (debugMode) { console.log(`Route: ${routeName}`); }

				if (routeName === this.options.indexName) {
					this.app.get('/', (req, res) => {
						res.send(routes[routeName].content);
					});
				} else {
					this.app.get(`/${routeName}`, (req, res) => {
						res.send(routes[routeName].content);
					});
				}
			}
		}

		return routes;
	}

	private createKonponent(name: string, content: string = '') {
		if (debugMode) { console.log(`Creating Konponent: ${name}`); }
		return new Konponent(this.app, name, content);
	}

	load() {
		if (debugMode) { console.log('Loading Konponents'); }

		while (Object.values(this.konponents).some(konp => />_([a-zA-Z0-9_-]+)/.test(konp.content))) {
			for (const konponentName in this.konponents) {
				const konp = this.konponents[konponentName];
				const regex = new RegExp('>_([a-zA-Z0-9_-]+)', 'g');
				konp.content = konp.content.replace(regex, (match, p1) => {
					return this.konponents[p1] ? this.konponents[p1].content : match;
				});
			}
		}

		for (const routeName in this.routes) {
			for (const konponentName in this.konponents) {
				if (this.routes[routeName].content.includes(`>_${konponentName}`)) {
					this.routes[routeName].content = this.routes[routeName].content.replace(`>_${konponentName}`, this.konponents[konponentName].content);
				}
			}
		}
	}
}

/* --------------------------------------- Classe Konponent --------------------------------------- */
class Konponent {
	private app: Express;
	private name: string;

	content: string;
	children: Konponents = {};

	constructor(app: Express, name: string, content: string) {
		this.app = app;
		this.name = name;
		this.content = content;
	}
}

/* --------------------------------------- Export --------------------------------------- */
export default function CreateKon(app: Express, options: Options = { folderName: '', indexName: '' }): Kon {
	return new Kon(app, options);
}

exports.default = CreateKon;