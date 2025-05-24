import { AlertPanel, AnchorElement, ButtonElement, CardPanel, Component, DivElement, FormElement, H4Element, Router, TextField } from "typecomposer";
import { Api } from "@/api/Api";

export class LoginPage extends Component {

	constructor() {
		super();
		this.append(new DivElement({ className: "background" }));
		const card = new CardPanel({ width: "400px", zIndex: "2" });
		const vbox = new FormElement({ action: `${Api.URL}/auth/login`, method: "post", variant: "vbox", onResponse: this.login.bind(this), gap: "10px" });
		vbox.append(new H4Element({ text: "48 - Matcha", className: "login_header", alignItems: "" }));
		vbox.append(new TextField({ label: "UserName", placeholder: "UserName", name: "username", required: true }));
		vbox.append(new TextField({ label: "Password", placeholder: "Password", type: "password", name: "password", required: true }));
		vbox.append(new ButtonElement({ text: "Login", width: "200px", height: "50px", margin: "0 auto", type: "submit" }));
		const div = new DivElement({ display: "flex", justifyContent: "space-between" });
		div.append(new AnchorElement({ text: "register", rlink: "register", zIndex: "" }));
		div.append(new AnchorElement({ text: "forgot password?", rlink: "forgot" }));
		vbox.append(div);
		card.append(vbox);
		this.append(card);
	}

	private async login(response: Response) {
		if (response.ok) {
			const { token } = await response.json();
			localStorage.setItem("token", token);
			Router.go("home");
		}
		else
			AlertPanel.error("Login failed: " + response.statusText);
	}
}