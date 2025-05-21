import { Api } from "@/api/Api";
import { AlertPanel, AnchorElement, ButtonElement, CardPanel, Component, computed, DivElement, H4Element, ref, Router, TextField, VBox } from "typecomposer";


export class ResetPassword extends Component {

	reset = ref({
		password: "",
		confirm: "",
	});
	token = Router.props["token"] || "";

	constructor() {
		super();
		if (!this.token) {
			Router.go("login");
		}
		this.append(new DivElement({ className: "background" }));
		const card = new CardPanel({ width: "400px", zIndex: "2" });
		const vbox = new VBox({ padding: "10px", gap: "15px" });
		vbox.append(new H4Element({ text: "48 - Matcha", className: "login_header" }));
		vbox.append(new TextField({ placeholder: "password", type: "password", value: this.reset.value.password }));
		vbox.append(new TextField({ placeholder: "confirm password", type: "password", value: this.reset.value.confirm }));

		vbox.append(new ButtonElement({
			disabled: computed(() => this.reset.value.password.toString().length == 0 || this.reset.value.password.toString() !== this.reset.value.confirm.toString(), [this.reset]),
			text: "forgot", width: "200px", height: "50px", margin: "0 auto", onclick: () => this.resetPassword()
		}));
		const div = new DivElement({ display: "flex", justifyContent: "space-between" });
		div.append(new AnchorElement({ text: "register", rlink: "register", zIndex: "" }));
		div.append(new AnchorElement({ text: "login", rlink: "login" }));
		vbox.append(div);
		card.append(vbox);
		this.append(card);
	}

	private resetPassword() {
		Api.User.resetPassword(this.token, this.reset.value.password.value).then((success) => {
			if (success) {
				AlertPanel.info("Password reset successfully");
				Router.go("login");
			}
		});
	}


}