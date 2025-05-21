import { Component, ref } from "typecomposer";




export class TestComponent extends Component {

	t = ref(true);

	constructor() {
		super();
	}


	template(): HTMLElement {
		return <div>
			<button onclick={() => { this.t.value = !this.t.value; console.log(this.t.value); }}>Test</button>
			<fragment>{this.t.value ? <div>oi</div> : <h2>asa</h2>}</fragment>
		</div>
	}

}