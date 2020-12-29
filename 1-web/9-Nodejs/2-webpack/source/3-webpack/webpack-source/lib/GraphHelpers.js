/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

/** @typedef {import("./AsyncDependenciesBlock")} AsyncDependenciesBlock */
/** @typedef {import("./Chunk")} Chunk */
/** @typedef {import("./ChunkGroup")} ChunkGroup */
/** @typedef {import("./DependenciesBlock")} DependenciesBlock */
/** @typedef {import("./Module")} Module */

/**
 * @param {ChunkGroup} chunkGroup the ChunkGroup to connect
 * @param {Chunk} chunk chunk to tie to ChunkGroup
 * @returns {void}
 */
const connectChunkGroupAndChunk = (chunkGroup, chunk) => {
	// 如存在 返回false，否则会将chunk push到 this.chunks里，
	// chunkGroup === new Entrypoint(name); chunk ==  this.addChunk(name)
	if (chunkGroup.pushChunk(chunk)) {
		// SortableSet 实现的一个set，提供了sort功能
		// Chunk.js 实际是 sortableSet.add(chunkGroup)
		chunk.addGroup(chunkGroup);
	}
};

/**
 * @param {ChunkGroup} parent parent ChunkGroup to connect
 * @param {ChunkGroup} child child ChunkGroup to connect
 * @returns {void}
 */
const connectChunkGroupParentAndChild = (parent, child) => {
	if (parent.addChild(child)) {
		child.addParent(parent);
	}
};

exports.connectChunkGroupAndChunk = connectChunkGroupAndChunk;
exports.connectChunkGroupParentAndChild = connectChunkGroupParentAndChild;
