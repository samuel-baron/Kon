"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const kon_1 = require("./kon");
const app = express();
const kon = (0, kon_1.default)(app, { folderName: 'site', indexName: 'index' });
kon.load();
