/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const Factory = require("enhanced-resolve").ResolverFactory;
const { HookMap, SyncHook, SyncWaterfallHook } = require("tapable");
const { cachedCleverMerge } = require("./util/cleverMerge");

/** @typedef {import("enhanced-resolve").Resolver} Resolver */

/**
 * @typedef {Object} WithOptions
 * @property {function(Object): ResolverWithOptions} withOptions create a resolver with additional/different options
 */

/** @typedef {Resolver & WithOptions} ResolverWithOptions */

const EMPTY_RESOLVE_OPTIONS = {};

/**
 * 这个类，主要是缓存，创建，不同key 的resolve
 * @typedef {Object} ResolverCache
 * @property {WeakMap<Object, ResolverWithOptions>} direct
 * @property {Map<string, ResolverWithOptions>} stringified
 */

module.exports = class ResolverFactory {
	constructor() {
		this.hooks = Object.freeze({
			/** @type {HookMap<SyncWaterfallHook<[Object]>>} */
			resolveOptions: new HookMap(
				() => new SyncWaterfallHook(["resolveOptions"])
			),
			/** @type {HookMap<SyncHook<[Resolver, Object, Object]>>} */
			resolver: new HookMap(
				() => new SyncHook(["resolver", "resolveOptions", "userResolveOptions"])
			)
		});
		/** @type {Map<string, ResolverCache>} */
		this.cache = new Map();
	}

	/**
	 * 缓存resolver, 分配对options与options.toString缓存
	 * @param {string} type type of resolver
	 * @param {Object=} resolveOptions options
	 * @returns {ResolverWithOptions} the resolver
	 */
	get(type, resolveOptions = EMPTY_RESOLVE_OPTIONS) {
		let typedCaches = this.cache.get(type);
		if (!typedCaches) {
			typedCaches = {
				direct: new WeakMap(),
				stringified: new Map()
			};
			this.cache.set(type, typedCaches);
		}
		const cachedResolver = typedCaches.direct.get(resolveOptions);
		if (cachedResolver) {
			return cachedResolver;
		}
		const ident = JSON.stringify(resolveOptions);
		const resolver = typedCaches.stringified.get(ident);
		if (resolver) {
			typedCaches.direct.set(resolveOptions, resolver);
			return resolver;
		}
		const newResolver = this._create(type, resolveOptions);
		typedCaches.direct.set(resolveOptions, newResolver);
		typedCaches.stringified.set(ident, newResolver);
		return newResolver;
	}

	/**
	 * @param {string} type type of resolver
	 * @param {Object} resolveOptions options
	 * @returns {ResolverWithOptions} the resolver
	 */
	_create(type, resolveOptions) {
		const originalResolveOptions = { ...resolveOptions };
		resolveOptions = this.hooks.resolveOptions.for(type).call(resolveOptions);
		// Factory.createResolver
		// Offers an async require.resolve function. It's highly configurable.
		// webpack使用这个插件，处理resole的各个参数，而resolveOptions则是传入的配置参数
		const resolver = /** @type {ResolverWithOptions} */ (Factory.createResolver(
			resolveOptions
		));
		if (!resolver) {
			throw new Error("No resolver created");
		}
		/** @type {Map<Object, ResolverWithOptions>} */
		const childCache = new Map();
		resolver.withOptions = options => {
			const cacheEntry = childCache.get(options);
			if (cacheEntry !== undefined) return cacheEntry;
			const mergedOptions = cachedCleverMerge(originalResolveOptions, options);
			const resolver = this.get(type, mergedOptions);
			childCache.set(options, resolver);
			return resolver;
		};
		this.hooks.resolver
			.for(type)
			.call(resolver, resolveOptions, originalResolveOptions);
		return resolver;
	}
};
