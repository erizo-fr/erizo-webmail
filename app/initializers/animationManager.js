import AnimationManager from "erizo-webmail/services/animationManager"

export function initialize (container, application) {
	application.register("service:animationManager", AnimationManager)

	application.inject("controller", "animationManager", "service:animationManager")
	application.inject("component", "animationManager", "service:animationManager")
}

export default {
  name: "animationManager",
  initialize: initialize,
}
