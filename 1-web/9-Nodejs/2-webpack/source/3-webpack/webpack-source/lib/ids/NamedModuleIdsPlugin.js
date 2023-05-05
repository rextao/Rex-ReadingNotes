/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const { compareModulesByIdentifier } = require("../util/comparators");
const {
	getShortModuleName,
	getLongModuleName,
	assignNames,
	getUsedModuleIds,
	assignAscendingModuleIds
} = require("./IdHelpers");

/** @typedef {import("../Compiler")} Compiler */
/** @typedef {import("../Module")} Module */

class NamedModuleIdsPlugin {
	constructor(options) {
		this.options = options || {};
	}

	/**
	 * Apply the plugin
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		const { root } = compiler;
		compiler.hooks.compilation.tap("NamedModuleIdsPlugin", compilation => {
			compilation.hooks.moduleIds.tap("NamedModuleIdsPlugin", modules => {
				const chunkGraph = compilation.chunkGraph;
				const context = this.options.context
					? this.options.context
					: compiler.context;

				const unnamedModules = assignNames(
					// 有效的module
					Array.from(modules).filter(module => {
						if (!module.needId) return false;
						// cgm.chunks.size
						if (chunkGraph.getNumberOfModuleChunks(module) === 0) return false;
						// cgm.id
						return chunkGraph.getModuleId(module) === null;
					}),
					m => getShortModuleName(m, context, root),
					(m, shortName) => getLongModuleName(shortName, m, context, root),
					compareModulesByIdentifier,
					// 返回的modules+ records.modules 的 id Set，即哪些id是被用过的
					getUsedModuleIds(compilation),
					// 设置module的cgm.id = name;
					(m, name) => chunkGraph.setModuleId(m, name)
				);
				if (unnamedModules.length > 0) {
					assignAscendingModuleIds(unnamedModules, compilation);
				}
			});
		});
	}
}

module.exports = NamedModuleIdsPlugin;
