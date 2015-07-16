import Api from "erizo-webmail/services/api"

export function initialize (container, application) {
	application.register("service:api", Api)

	application.inject("route", "api", "service:api")
	application.inject("controller", "api", "service:api")
	application.inject("component", "api", "service:api")
}

export default {
  name: "api",
  initialize: initialize,
}
