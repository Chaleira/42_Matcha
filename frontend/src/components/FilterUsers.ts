import { ButtonElement, Component, SpanElement, VBox } from "typecomposer";
import { RangeSlider } from "./RangeSlider";
import HomeView from "@/views/home/HomeView";
import { Api } from "@/api/Api";


class FilterRangeSlider extends VBox {

	constructor(title: string, min: number = 0, max: number = 100) {
		super()
		this.append(new SpanElement({ text: title, textAlign: "center" }), new RangeSlider(min, max));
	}

}

export class FilterUsers extends Component {

	constructor() {
		super({
			padding: "10px",
			gap: "10px",
			display: "flex", justifyContent: "flex-start", alignItems: "center",
			width: "auto", minHeight: "50px", margin: "10px", marginRight: "10px", marginLeft: "10px", backgroundColor: "white", boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.1)"
		});
		this.append(new FilterRangeSlider("Age"));
		this.append(new FilterRangeSlider("Range", 1, 5));
		this.append(new ButtonElement({
			text: "Filter", onclick: () => {
				Api.User.list();
				console.log("Filter")
			}
		}));
	}
}