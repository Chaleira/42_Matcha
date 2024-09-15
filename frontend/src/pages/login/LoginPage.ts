import { AnchorElement, ButtonElement, CardElement, Component, DivElement, H4Element, ref, Router, TextFieldElement, VBoxElement } from "typecomposer";
import { Api } from "../../api/Api";


export class LoginPage extends Component {

	user = ref({ email: Router.props["email"] || "", password: "" });

	constructor() {
		super();
		this.append(new DivElement({ className: "background" }));
		const card = new CardElement({ width: "400px", zIndex: "2" });
		const vbox = new VBoxElement({ padding: "10px", gap: "15px" });
		vbox.append(new H4Element({ text: "48 - Matcha", className: "login_header" }));
		vbox.append(new TextFieldElement({ placeholder: "Email", value: this.user.value.email }));
		vbox.append(new TextFieldElement({ placeholder: "Password", type: "password", value: this.user.value.password }));
		vbox.append(new ButtonElement({ text: "Login", width: "200px", height: "50px", margin: "0 auto", onclick: () => this.login() }));
		const div = new DivElement({ display: "flex", justifyContent: "space-between" });
		div.append(new AnchorElement({ text: "register", rlink: "#/register", zIndex: "" }));
		div.append(new AnchorElement({ text: "forgot password?", rlink: "#/forgot" }));
		vbox.append(div);
		card.append(vbox);
		this.append(card);
	}

	private login() {
		Api.User.login(this.user.value.email, this.user.value.password).then((success) => {
			if (success) {
				Router.go("#/home");
			}
		});
	}
}