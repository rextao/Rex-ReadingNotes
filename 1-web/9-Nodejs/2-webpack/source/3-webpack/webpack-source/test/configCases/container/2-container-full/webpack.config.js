const { ModuleFederationPlugin } = require("../../../../").container;

/** @type {import("../../../../").Configuration} */
module.exports = {
	plugins: [
		new ModuleFederationPlugin({
			name: "main",
			library: { type: "commonjs-module" },
			remotes: {
				containerB: "../1-container-full/container.js",
				self: [
					"var undefined",
					"var (() => { throw new Error(); })()",
					"var { then: (a, b) => b(new Error()) }",
					"./bundle0.js"
				]
			},
			exposes: ["./Self"],
			shared: ["react"]
		})
	]
};
