import { BorderPaneElement, RouteView } from 'typecomposer'

export class AppPage extends BorderPaneElement {

	constructor() {
		super({ height: "100vh", width: "100vw", backgroundColor: "#f0f0f0" });
	}

	onInit(): void {
		this.center = new RouteView();
	}
}