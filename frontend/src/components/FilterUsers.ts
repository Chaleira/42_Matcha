import { ButtonElement, Component, DropDown, HBox, ref, refNumber, SpanElement, TextField, VBox } from "typecomposer";
import { RangeSlider } from "./RangeSlider";
import HomeView from "@/views/home/HomeView";
import { IFilter } from "@/api/Interfaces";
import { TagList } from "./TagList";


class FilterRangeSlider extends VBox {

	constructor(title: string, valueMin: refNumber, valueMax: refNumber, min: number = 0, max: number = 100) {
		super({
			className: "filter-range-slider",
		})
		this.append(new SpanElement({ text: title, textAlign: "center" }), new RangeSlider(valueMin, valueMax, min, max));
	}

}

export class FilterUsers extends Component {

	filter = ref<IFilter>({
		name: "",
		gender: "",
		sexual_preference: "",
		fame_min: 1,
		fame_max: 100,
		tags: [],
		latitude: 0,
		longitude: 0,
		radius_km: 30,
		age_min: 18,
		age_max: 100,
		order_by: "distance"
	})

	constructor() {
		super({
			gap: "10px",
			className: "filter-users",
			width: "auto", margin: "10px", marginRight: "10px", marginLeft: "10px", backgroundColor: "white", boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.1)"
		});
		const vbox = this.appendChild(new HBox({ gap: "10px", padding: "10px", width: "100%", alignItems: "center" }));
		vbox.append(new FilterRangeSlider("Age", this.filter.value.age_min, this.filter.value.age_max, 18, 100));
		vbox.append(new FilterRangeSlider("Fame", this.filter.value.fame_min, this.filter.value.fame_max, 1, 100));
		vbox.append(new TextField({
			type: "number",
			min: "10",
			label: "Distance (km)",
			className: "filter-distance",
			value: this.filter.value.radius_km,
		}))

		this.append(
			new HBox({
				gap: "10px", padding: "10px", width: "100%", alignItems: "center",
				children: [
					new SpanElement({ text: "Tags", fontSize: "20px", fontWeight: "bold", textAlign: "center" }),
					new TagList(this.filter as any)]
			}));
		vbox.append(new ButtonElement({
			className: "btn-filter",
			text: "Filter", onclick: () => this.getParent<HomeView>()?.listerUsers(this.filter.toJSON())
		}));
		vbox.append(new DropDown({
			placeholder: "Sort",
			value: this.filter.value.order_by,
			textValue: (value) => {
				switch (value) {
					case "distance":
						return "Distance";
					case "fame_score":
						return "Fame";
					case "age":
						return "Age";
					case "shared_tags":
						return "Tags";
				}
				return ""
			},
			options: ["distance", "fame_score", "age", "shared_tags"],
			onchange: (e) => {
				this.getParent<HomeView>()?.listerUsers(this.filter.toJSON())
			}
		}))
	}

	onConnected(): void {
		setTimeout(() => {
			this.getParent<HomeView>()?.listerUsers(this.filter.toJSON())
		}, 300);
	}
}