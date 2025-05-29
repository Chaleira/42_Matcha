import { Api } from "@/api/Api";
import { AlertPanel, ButtonElement, CardPanel, Component, DivElement, H1Element, Router, VBox } from "typecomposer";


export class VerifyEmail extends Component {

	constructor() {
		super({ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" });
		this.validateEmail();
	}


	async validateEmail() {
		const token = Router.props.token
		if (!token) {
			AlertPanel.warning("Email verification token is missing");
			Router.go("login");
			return;
		}
		const response = await fetch(`${Api.URL}/auth/verify-email`, {
			params: { token },
		});
		const username = response.ok ? (await response.json()).username : null;
		const card = new CardPanel({ width: "450px" });
		this.append(new DivElement({ className: "background", zIndex: "-1" }));
		const vbox = new VBox({ padding: "10px", gap: "15px" });
		const div = new DivElement({ display: "flex", justifyContent: "space-between" });
		vbox.append(new H1Element({
			text: response.ok ? "Email verified successfully" : "Email verification failed"
			, textAlign: "center", fontSize: "30px", fontWeight: "bold", color: "black"
		}));
		vbox.append(div);
		vbox.append(new ButtonElement({
			text: "login", width: "200px", height: "50px", margin: "0 auto",
			onclick: () => {
				Router.go("login", username ? { email: username } : undefined);
			}
		}))
		card.append(vbox);
		this.append(card);


	}
}