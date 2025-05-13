import { Component } from "typecomposer";


export default class TestLazy extends Component {

	constructor() {
		super({ color: "red", className: "test-lazy", width: "100vw", height: "50px", overflowX: "hidden", overflowY: "auto", text: "Lazy" });
	}
}