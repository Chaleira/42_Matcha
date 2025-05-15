import { AnchorElement, CardPanel, Component, DivElement, ref, SpanElement, VBox } from "typecomposer";
import { IUser } from "@/api/Interfaces";
import { RegisterStep1 } from "./steps/RegisterStep1";

export class RegisterPage extends Component {

	private user = ref<IUser>();
	private msg = ref<string>("");
	private card = new CardPanel({ width: "450px" });


	constructor() {
		super({ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" });
		this.append(new DivElement({ className: "background", zIndex: "-1" }));
		this.card.append(RegisterStep1(this.user, this.card));
		const vbox = new VBox({ padding: "10px", gap: "15px" });
		const div = new DivElement({ display: "flex", justifyContent: "space-between" });
		div.append(new AnchorElement({ text: "login", rlink: "login" }));
		div.append(new AnchorElement({ text: "forgot password?", rlink: "forgot" }));
		vbox.append(new SpanElement({ text: this.msg, color: "red" }));
		vbox.append(div);
		this.card.append(vbox);
		this.append(this.card);
	}

}