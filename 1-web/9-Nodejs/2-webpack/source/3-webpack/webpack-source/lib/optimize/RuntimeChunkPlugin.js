/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const { STAGE_ADVANCED } = require("../OptimizationStages");

/** @typedef {import("../Compiler")} Compiler */

class RuntimeChunkPlugin {
	// 注意： 在WebpackOptionsApply.js中，插件传入的options是。options.optimization.runtimeChunk
	// 初试值在normalization.js配置，默认情况下，会配置一个name函数，
	constructor(options) {
		this.options = {
			name: entrypoint => `runtime~${entrypoint.name}`,
			...options
		};
	}

	/**
	 * Apply the plugin
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.thisCompilation.tap("RuntimeChunkPlugin", compilation => {
			compilation.hooks.optimizeChunks.tap(
				{
					name: "RuntimeChunkPlugin",
					stage: STAGE_ADVANCED
				},
				() => {
					const chunkGraph = compilation.chunkGraph;
					for (const entrypoint of compilation.entrypoints.values()) {
						// options.dependOn未设置,则runtimeChunk是最后一个入口chunk
						const chunk = entrypoint.getRuntimeChunk();
						// Only insert a runtime chunk when the current runtime chunk is part of the entrypoint
						if (!entrypoint.chunks.includes(chunk)) continue;
						// Determine runtime chunk name
						// name:  entrypoint => `runtime~${entrypoint.name}`
						let name = this.options.name;
						if (typeof name === "function") {
							name = name(entrypoint);
						}
						// Avoid adding runtime chunk twice
						if (
							chunkGraph.getNumberOfChunkModules(chunk) > 0 ||
							!chunk.preventIntegration ||
							chunk.name !== name
						) {
							const newChunk = compilation.addChunk(name);
							newChunk.preventIntegration = true;
							entrypoint.unshiftChunk(newChunk);
							newChunk.addGroup(entrypoint);
							entrypoint.setRuntimeChunk(newChunk);
						}
					}
				}
			);
		});
	}
}

module.exports = RuntimeChunkPlugin;
