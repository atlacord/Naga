import config from '../config/config';
import logger from '../core/Logger';

const importedModules = {};
const loadedModules = {};

try { var modules = require('./index'); } catch (err) { console.error(err); }

for (let [key, module] of Object.entries(importedModules)) {
    if (config.modules.includes(key)) {
        loadedModules[key] = module;
    }
}

if (modules) {
    for (let [key, module] of Object.entries(modules)) {
        if (config.modules.includes(key)) {
            loadedModules[key] = module;
        }
    }
}

export = {
    hasModules: true,
    modules: loadedModules,
};