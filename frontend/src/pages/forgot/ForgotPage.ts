import { AnchorElement, ButtonElement, CardElement, Component, DivElement, H4Element, TextFieldElement, VBoxElement } from "typecomposer";


export class ForgotPage extends Component {

	constructor() {
		super({ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" });
		const card = new CardElement({ width: "400px" });
		const vbox = new VBoxElement({ padding: "10px", gap: "15px" });

		vbox.append(new H4Element({ text: "Matcha", className: "login_header", }));
		vbox.append(new TextFieldElement({ placeholder: "Username" }));
		vbox.append(new TextFieldElement({ placeholder: "Password" }));
		vbox.append(new ButtonElement({ text: "Login", width: "200px", height: "50px", margin: "0 auto" }));
		const div = new DivElement({ display: "flex", justifyContent: "space-between" });
		div.append(new AnchorElement({ text: "Register", rlink: "#/register" }));
		div.append(new AnchorElement({ text: "Forgot password?", rlink: "#/forgot" }));
		vbox.append(div);
		card.append(vbox);
		this.append(card);
	}

}