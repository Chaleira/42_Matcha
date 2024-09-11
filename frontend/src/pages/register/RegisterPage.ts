import { AnchorElement, ButtonElement, CardElement, Component, DivElement, H4Element, ref, Router, SpanElement, TextFieldElement, VBoxElement } from "typecomposer";
import { Api } from "../../api/Api";


export class RegisterPage extends Component {

	user = ref({ username: "", email: "", password: "", confirmPassword: "", msg: "" });

	constructor() {
		super({ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" });
		const card = new CardElement({ width: "400px" });
		const vbox = new VBoxElement({ padding: "10px", gap: "15px" });

		vbox.append(new H4Element({ text: "Register", className: "login_header", }));
		vbox.append(new TextFieldElement({ placeholder: "Username", value: this.user.value.username }));
		vbox.append(new TextFieldElement({ placeholder: "Email", value: this.user.value.email }));
		vbox.append(new TextFieldElement({ placeholder: "Password", type: "password", value: this.user.value.password }));
		vbox.append(new TextFieldElement({ placeholder: "Confirm password", type: "password", value: this.user.value.confirmPassword }));
		vbox.append(new SpanElement({ text: this.user.value.msg, color: "red" }));
		vbox.append(new ButtonElement({ text: "Register", width: "200px", height: "50px", margin: "0 auto", onclick: () => this.register() }));
		const div = new DivElement({ display: "flex", justifyContent: "space-between" });
		div.append(new AnchorElement({ text: "login", rlink: "#/login" }));
		div.append(new AnchorElement({ text: "forgot password?", rlink: "#/forgot" }));
		vbox.append(div);
		card.append(vbox);
		this.append(card);
	}

	private register() {
		if (this.user.value.password.toString() == this.user.value.confirmPassword.toString()) {
			this.user.value.msg = "";
			Api.User.register(this.user.value.username, this.user.value.email, this.user.value.password).then((success) => {
				if (success) {
					Router.go("#/login", { email: this.user.value.email });
				}
			});
		}
		else {
			this.user.value.msg = "Passwords do not match";
		}
	}

}