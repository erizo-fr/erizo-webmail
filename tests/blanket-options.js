/* globals blanket, module */

var options = {
	modulePrefix: "erizo-webmail",
	filter: "//.*erizo-webmail/.*/",
	antifilter: "//.*(tests|template).*/",
	loaderExclusions: [],
	enableCoverage: true,
	cliOptions: {
		reporters: ["lcov"],
		autostart: true,
		lcovOptions: {
			outputFile: "coverage/lcov.dat",
		},
	},
}
if (typeof exports === "undefined") {
	blanket.options(options)
} else {
	module.exports = options
}
