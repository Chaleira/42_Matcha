import { Api } from "@/api/Api";
import { AlertPanel, AnchorElement, ButtonElement, CardPanel, Component, DivElement, H4Element, ref, Router, TextField, VBox } from "typecomposer";


export class ForgotPage extends Component {

	email = ref("");

	constructor() {
		super();
		this.append(new DivElement({ className: "background" }));
		const card = new CardPanel({ width: "400px", zIndex: "2" });
		const vbox = new VBox({ padding: "10px", gap: "15px" });
		vbox.append(new H4Element({ text: "48 - Matcha", className: "login_header" }));
		vbox.append(new TextField({ label: "Email", placeholder: "email", type: "email", value: this.email }));
		vbox.append(new ButtonElement({ text: "forgot", width: "200px", height: "50px", margin: "0 auto", onclick: () => this.forgot() }));
		const div = new DivElement({ display: "flex", justifyContent: "space-between" });
		div.append(new AnchorElement({ text: "register", rlink: "register", zIndex: "" }));
		div.append(new AnchorElement({ text: "login", rlink: "login" }));
		vbox.append(div);
		card.append(vbox);
		this.append(card);
	}

	private forgot() {
		Api.User.sendResetPassword(this.email.value).then((success) => {
			if (success) {
				Router.go("login");
			}
		});
	}

}