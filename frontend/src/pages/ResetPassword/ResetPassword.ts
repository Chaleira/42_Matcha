import { Api } from "@/api/Api";
import { AlertPanel, AnchorElement, ButtonElement, CardPanel, Component, computed, DivElement, H4Element, ref, Router, SpanElement, TextField, VBox } from "typecomposer";
import common from "@/assets/10k-most-common.json"

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
		const validateStep1 = computed(() => {
			const password = this.reset.value.password.value.toString().trim();
			const confirmPasswordValue = this.reset.value.confirm.value.toString().trim();
			return !(
				password.length > 0 &&
				confirmPasswordValue.length > 8 &&
				common.words.includes(confirmPasswordValue.toLowerCase()) == false &&
				password == confirmPasswordValue);
		}, [this.reset]);
		this.append(new DivElement({ className: "background" }));
		const card = new CardPanel({ width: "400px", zIndex: "2" });
		const vbox = new VBox({ padding: "10px", gap: "15px" });
		vbox.append(new H4Element({ text: "48 - Matcha", className: "login_header" }));
		vbox.append(new TextField({ placeholder: "password", type: "password", value: this.reset.value.password, minLength: 12, maxLength: 50 }));
		vbox.append(new TextField({ placeholder: "confirm password", type: "password", value: this.reset.value.confirm, minLength: 12, maxLength: 50 }));
		vbox.append(new SpanElement({
			text: "password must be at least 12 characters long and not a common word.",
		}))
		vbox.append(new ButtonElement({
			disabled: validateStep1,
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