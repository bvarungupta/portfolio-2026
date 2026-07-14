import Three from "./core/Three";
import "./style.css";

document.addEventListener("DOMContentLoaded", async () => {
	const container = document.querySelector("#app");
	const three = new Three(container);
	await three.run();
	await three.scene.ready;
	document.body.classList.remove("loading");
});
