"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
/* --------------------------------------- Debug --------------------------------------- */
const debugMode = false;
const importPath = require.main.filename.split('\\').slice(0, -1).join('\\');
/* --------------------------------------- Classe Kon --------------------------------------- */
class Kon {
    constructor(app, options) {
        this.routes = {};
        this.konponents = {};
        this.app = app;
        this.options = this.initializeOptions(options);
        this.routes = this.initializeRoutes();
        this.konponents = this.initializeKonponents();
    }
    initializeOptions(options) {
        if (debugMode) {
            console.log(`Initializing options: ${JSON.stringify(options)}`);
        }
        if (!options.folderName) {
            options.folderName = 'site';
        }
        if (!options.indexName) {
            options.indexName = 'index';
        }
        return options;
    }
    initializeKonponents() {
        const konponents = {};
        if (debugMode) {
            console.log('Initializing konponents');
        }
        const recursiveSearch = (folderPath) => {
            const files = fs.readdirSync(folderPath);
            for (const file of files) {
                const filePath = path.join(folderPath, file);
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                    recursiveSearch(filePath);
                }
                else if (file.endsWith('.kon.html')) {
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
    initializeRoutes() {
        const routes = {};
        if (debugMode) {
            console.log('Initializing routes');
        }
        const recursiveSearch = (folderPath, routePrefix = '') => {
            const files = fs.readdirSync(folderPath);
            for (const file of files) {
                const filePath = path.join(folderPath, file);
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                    recursiveSearch(filePath, routePrefix + file + '/');
                }
                else if (file.endsWith('.html') && !file.endsWith('.kon.html')) {
                    const routeName = routePrefix + file.replace('.html', '');
                    // Check if the file name (without extension) matches the last folder name
                    const lastFolderName = folderPath.split(path.sep).pop() || '';
                    const fileNameWithoutExtension = file.replace('.html', '');
                    let finalRoute;
                    if (lastFolderName === fileNameWithoutExtension) {
                        finalRoute = `/${routePrefix.slice(0, -1)}`;
                    }
                    else {
                        finalRoute = `/${routePrefix}${fileNameWithoutExtension}`;
                    }
                    const routeContent = fs.readFileSync(filePath, 'utf8');
                    routes[routeName] = this.createKonponent(routeName, routeContent);
                    if (debugMode) {
                        console.log(`Route: ${routeName}`);
                    }
                    this.app.get(finalRoute, (req, res) => {
                        res.send(routes[routeName].content);
                    });
                }
            }
        };
        const konponentsFolder = path.join(importPath, this.options.folderName);
        recursiveSearch(konponentsFolder);
        return routes;
    }
    createKonponent(name, content = '') {
        if (debugMode) {
            console.log(`Creating Konponent: ${name}`);
        }
        return new Konponent(this.app, name, content);
    }
    load() {
        if (debugMode) {
            console.log('Loading Konponents');
        }
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
    constructor(app, name, content) {
        this.children = {};
        this.app = app;
        this.name = name;
        this.content = content;
    }
}
/* --------------------------------------- Export --------------------------------------- */
function konponent(app, options = { folderName: '', indexName: '' }) {
    return new Kon(app, options);
}
exports.default = konponent;
exports.default = konponent;
