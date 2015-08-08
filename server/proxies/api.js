var proxyPath = "/api"

module.exports = function (app) {
	// For options, see:
	// https://github.com/nodejitsu/node-http-proxy
	var proxy = require("http-proxy").createProxyServer({})

	proxy.on("error", function (err, req) {
		console.error(err, req.url)
	})

	app.use(proxyPath, function (req, res) {
		// include root path in proxied request
		req.url = proxyPath + "/" + req.url
		proxy.web(req, res, {target: "http://localhost:8081/"})
	})
	console.info("Proxy server is bound to " + proxyPath)
}
