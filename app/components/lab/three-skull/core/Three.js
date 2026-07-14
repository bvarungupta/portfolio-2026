import * as THREE from "three/webgpu";
import WebGPUContext from "./WebGPUContext";
import Scene from "../scenes/Scene";
import MouseTrail from "../utils/MouseTrail";
import FluidSim from "../postprocessing/FluidSim";
import PostProcessing from "../postprocessing/PostProcessing";

class Three {
	constructor(container) {
		this.container = container;
		this.clock = new THREE.Clock();
	}

	async run() {
		this.context = new WebGPUContext(this.container);
		await this.context.init();

		this.#setup();
		this.#animate();
		this.#addResizeListener();
	}

	#setup() {
		const { width, height } = this.context.getFullScreenDimensions();
		const pr = this.context.pixelRatio;
		this.scene = new Scene();
		this.mouseTrail = new MouseTrail(width * pr, height * pr);
		this.fluidSim = new FluidSim(width * pr, height * pr);

		this.postProcessing = new PostProcessing(
			this.context.renderer,
			this.scene.solidScene,
			this.scene.wireScene,
			this.scene.camera,
			this.fluidSim.texture,
		);
	}

	#animate() {
		const delta = this.clock.getDelta();

		this.scene.animate(delta, this.clock.elapsedTime);

		// Update mouse trail → fluid sim
		this.mouseTrail.update(
			this.scene.cameraRig.mouseNormalized.x,
			this.scene.cameraRig.mouseNormalized.y,
		);
		this.fluidSim.update(this.context.renderer, this.mouseTrail.texture);

		// Render everything (scene passes + effects)
		this.postProcessing.render();

		this.animationId = requestAnimationFrame(() => this.#animate());
	}

	#addResizeListener() {
		window.addEventListener("resize", () => this.#onResize());
	}

	#onResize() {
		const { width, height } = this.context.getFullScreenDimensions();
		const pr = this.context.pixelRatio;

		this.context.onResize(width, height);
		this.scene.onResize(width, height);
		this.fluidSim.onResize(width * pr, height * pr);
	}

	destroy() {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
		}

		if (this.scene && this.scene.cameraRig) {
			this.scene.cameraRig.destroy();
		}

		if (this.postProcessing) this.postProcessing.dispose();
		if (this.fluidSim) this.fluidSim.dispose();
		if (this.mouseTrail) this.mouseTrail.dispose();

		if (this.context && this.context.canvas && this.context.canvas.parentNode) {
			this.context.canvas.parentNode.removeChild(this.context.canvas);
		}
	}
}

export default Three;
