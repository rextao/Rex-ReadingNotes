/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra and Zackary Jackson @ScriptedAlchemy
*/

"use strict";

const { OriginalSource } = require("webpack-sources");
const AsyncDependenciesBlock = require("../AsyncDependenciesBlock");
const Module = require("../Module");
const RuntimeGlobals = require("../RuntimeGlobals");
const Template = require("../Template");
const createHash = require("../util/createHash");
const makeSerializable = require("../util/makeSerializable");
const RemoteOverrideDependency = require("./RemoteOverrideDependency");

/** @typedef {import("../../declarations/WebpackOptions").WebpackOptionsNormalized} WebpackOptions */
/** @typedef {import("../Chunk")} Chunk */
/** @typedef {import("../ChunkGraph")} ChunkGraph */
/** @typedef {import("../ChunkGroup")} ChunkGroup */
/** @typedef {import("../Compilation")} Compilation */
/** @typedef {import("../Module").CodeGenerationContext} CodeGenerationContext */
/** @typedef {import("../Module").CodeGenerationResult} CodeGenerationResult */
/** @typedef {import("../Module").LibIdentOptions} LibIdentOptions */
/** @typedef {import("../Module").NeedBuildContext} NeedBuildContext */
/** @typedef {import("../RequestShortener")} RequestShortener */
/** @typedef {import("../ResolverFactory").ResolverWithOptions} ResolverWithOptions */
/** @typedef {import("../WebpackError")} WebpackError */
/** @typedef {import("../util/Hash")} Hash */
/** @typedef {import("../util/fs").InputFileSystem} InputFileSystem */

/**
 * @typedef {Object} OverrideOptions
 * @property {string} import request to new module
 */

const TYPES = new Set(["javascript"]);

class RemoteOverridesModule extends Module {
	/**
	 * @param {[string, OverrideOptions][]} overrides list of overrides
	 */
	constructor(overrides) {
		super("remote-overrides-module");
		this._overrides = overrides;
		if (overrides.length > 0) {
			const hash = createHash("md4");
			for (const [key, request] of overrides) {
				hash.update(key);
				hash.update(request.import);
			}
			this._overridesHash = hash.digest("hex");
		} else {
			this._overridesHash = "empty";
		}
	}

	/**
	 * @returns {string} a unique identifier of the module
	 */
	identifier() {
		return `remote overrides ${this._overridesHash}`;
	}

	/**
	 * @param {RequestShortener} requestShortener the request shortener
	 * @returns {string} a user readable identifier of the module
	 */
	readableIdentifier(requestShortener) {
		return `remote overrides ${this._overrides
			.map(([key, request]) => `${key} = ${request}`)
			.join(", ")}`;
	}

	/**
	 * @param {LibIdentOptions} options options
	 * @returns {string | null} an identifier for library inclusion
	 */
	libIdent(options) {
		return `webpack/container/remote-overrides/${this._overridesHash.slice(
			0,
			6
		)}`;
	}

	/**
	 * @param {NeedBuildContext} context context info
	 * @param {function(WebpackError=, boolean=): void} callback callback function, returns true, if the module needs a rebuild
	 * @returns {void}
	 */
	needBuild(context, callback) {
		callback(null, !this.buildInfo);
	}

	/**
	 * @param {WebpackOptions} options webpack options
	 * @param {Compilation} compilation the compilation
	 * @param {ResolverWithOptions} resolver the resolver
	 * @param {InputFileSystem} fs the file system
	 * @param {function(WebpackError=): void} callback callback function
	 * @returns {void}
	 */
	build(options, compilation, resolver, fs, callback) {
		this.buildMeta = {};
		this.buildInfo = {
			strict: true
		};

		this.clearDependenciesAndBlocks();
		for (const [, options] of this._overrides) {
			const block = new AsyncDependenciesBlock({});
			const dep = new RemoteOverrideDependency(options.import);
			block.addDependency(dep);
			this.addBlock(block);
		}

		callback();
	}

	/**
	 * @param {Chunk} chunk the chunk which condition should be checked
	 * @param {Compilation} compilation the compilation
	 * @returns {boolean} true, if the chunk is ok for the module
	 */
	chunkCondition(chunk, { chunkGraph }) {
		return chunkGraph.getNumberOfEntryModules(chunk) > 0;
	}

	/**
	 * @param {string=} type the source type for which the size should be estimated
	 * @returns {number} the estimated size of the module (must be non-zero)
	 */
	size(type) {
		return 42;
	}

	/**
	 * @returns {Set<string>} types available (do not mutate)
	 */
	getSourceTypes() {
		return TYPES;
	}

	/**
	 * @param {CodeGenerationContext} context context for code generation
	 * @returns {CodeGenerationResult} result
	 */
	codeGeneration({ runtimeTemplate, moduleGraph, chunkGraph }) {
		const runtimeRequirements = new Set([RuntimeGlobals.module]);
		let i = 0;
		const source = Template.asString([
			`module.exports = ${runtimeTemplate.basicFunction(
				"external",
				this._overrides.length > 0
					? [
							"if(external.override) external.override(Object.assign({",
							Template.indent(
								this._overrides
									.map(([key, options]) => {
										const block = this.blocks[i++];
										const dep = block.dependencies[0];
										const module = moduleGraph.getModule(dep);
										return `${JSON.stringify(
											key
										)}: ${runtimeTemplate.basicFunction(
											"",
											`return ${runtimeTemplate.blockPromise({
												block,
												message: "",
												chunkGraph,
												runtimeRequirements
											})}.then(${runtimeTemplate.basicFunction(
												"",
												`return ${runtimeTemplate.returningFunction(
													runtimeTemplate.moduleRaw({
														module,
														chunkGraph,
														request: options.import,
														runtimeRequirements
													})
												)}`
											)})`
										)}`;
									})
									.join(",\n")
							),
							`}, ${RuntimeGlobals.overrides}));`,
							"return external;"
					  ]
					: [
							`if(external.override) external.override(${RuntimeGlobals.overrides});`,
							"return external;"
					  ]
			)};`
		]);
		const sources = new Map();
		sources.set(
			"javascript",
			new OriginalSource(
				source,
				`webpack/remote-overrides ${this._overridesHash}`
			)
		);
		return { sources, runtimeRequirements };
	}

	serialize(context) {
		const { write } = context;
		write(this._overrides);
		super.serialize(context);
	}

	static deserialize(context) {
		const { read } = context;
		const obj = new RemoteOverridesModule(read());
		obj.deserialize(context);
		return obj;
	}
}

makeSerializable(
	RemoteOverridesModule,
	"webpack/lib/container/RemoteOverridesModule"
);

module.exports = RemoteOverridesModule;
