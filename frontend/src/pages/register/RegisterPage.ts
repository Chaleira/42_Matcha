import { AnchorElement, AvatarElement, ButtonElement, CardElement, Component, DivElement, DropDown, H4Element, HBoxElement, ref, Router, SpanElement, TextAreaElement, TextFieldElement, VBoxElement } from "typecomposer";
import { Api } from "@/api/Api";
import { AlbumContainer } from "@/components/AlbumContainer";
import { TagList } from "@/components/TagList";



export class RegisterPage extends Component {

	user = ref<any>({
		username: "", email: "", password: "", confirmPassword: "", avatar: "", msg: "", album: [], dateBirth: new Date().toISOString(),
		firstName: "", lastName: "", bio: "w", tags: [], gender: "male", sexualOrientation: "heterosexual"
	});
	private card = new CardElement({ width: "450px" });

	constructor() {
		super({ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" });
		this.append(new DivElement({ className: "background", zIndex: "-1" }));
		this.card.append(this.step1());
		const vbox = new VBoxElement({ padding: "10px", gap: "15px" });
		const div = new DivElement({ display: "flex", justifyContent: "space-between" });
		div.append(new AnchorElement({ text: "login", rlink: "#/login" }));
		div.append(new AnchorElement({ text: "forgot password?", rlink: "#/forgot" }));
		vbox.append(new SpanElement({ text: this.user.value.msg, color: "red" }));
		vbox.append(div);
		this.card.append(vbox);
		this.append(this.card);
	}

	private step1(): VBoxElement {
		const vbox = new VBoxElement({ padding: "10px", gap: "15px" });
		vbox.append(new H4Element({ text: "Register", className: "login_header", }));
		vbox.append(new TextFieldElement({ placeholder: "Username", value: this.user.value.username }));
		vbox.append(new TextFieldElement({ placeholder: "Email", value: this.user.value.email }));
		vbox.append(new TextFieldElement({ placeholder: "Password", type: "password", value: this.user.value.password }));
		vbox.append(new TextFieldElement({ placeholder: "Confirm password", type: "password", value: this.user.value.confirmPassword }));
		vbox.append(new ButtonElement({
			text: "Next", width: "200px", height: "50px", margin: "0 auto", onclick: () => {
				this.card.replaceChild(this.step2(), this.card.children[0]);
			}
		}));
		return vbox;
	}

	private step2(): VBoxElement {
		const vbox = new VBoxElement({ padding: "10px", gap: "15px" });
		vbox.append(new H4Element({ text: "Register", className: "login_header", }));
		vbox.append(new TextFieldElement({ placeholder: "First Name", value: this.user.value.firstName }));
		vbox.append(new TextFieldElement({ placeholder: "Last Name", value: this.user.value.lastName }));
		vbox.append(new TextFieldElement({ type: "date", placeholder: "Date Birth", value: this.user.value.dateBirth }));
		const hbox1 = new HBoxElement({ gap: "10px" });
		hbox1.append(new DropDown({
			placeholder: "Gender",
			options: ["male", "female", "develop"],
			value: this.user.value.gender,
			width: "48%"
		}));
		hbox1.append(new DropDown({
			placeholder: "Sexual Orientation",
			options: [
				"heterosexual", "Viado"
			],
			value: this.user.value.sexualOrientation,
			width: "48%"

		}));
		vbox.append(hbox1);
		const hbox2 = new HBoxElement({ gap: "10px" });
		hbox2.append(new ButtonElement({
			text: "Back", width: "48%", height: "50px", margin: "0 auto", onclick: () => {
				this.card.replaceChild(this.step1(), this.card.children[0]);
			}
		}));
		hbox2.append(new ButtonElement({
			text: "Next", width: "48%", height: "50px", margin: "0 auto", onclick: () => {
				this.card.replaceChild(this.step3(), this.card.children[0]);
			}
		}));
		vbox.append(hbox2);
		return vbox;
	}

	private step3(): VBoxElement {
		const vbox = new VBoxElement({ padding: "10px", gap: "15px" });
		vbox.append(new SpanElement({ text: "Bio" }));
		vbox.append(new TextAreaElement({ text: "Register", className: "login_header", height: "100px", value: this.user.value.bio }));
		vbox.append(new SpanElement({ text: "Tags" }));
		vbox.append(new TagList(this.user));
		const hbox2 = new HBoxElement({ gap: "10px" });
		hbox2.append(new ButtonElement({
			text: "Back", width: "48%", height: "50px", margin: "0 auto", onclick: () => {
				this.card.replaceChild(this.step2(), this.card.children[0]);
			}
		}));
		hbox2.append(new ButtonElement({
			text: "Next", width: "48%", height: "50px", margin: "0 auto", onclick: () => {
				this.card.replaceChild(this.step4(), this.card.children[0]);
			}
		}));
		vbox.append(hbox2);
		return vbox;
	}

	private step4(): VBoxElement {
		const vbox = new VBoxElement({ padding: "10px", gap: "15px" });
		vbox.append(new SpanElement({ text: "Avatar" }));
		vbox.append(new AvatarElement({src: this.user.value.avatar}));
		vbox.append(new SpanElement({ text: "Album" }));
		vbox.append(new AlbumContainer({ maxHeight: "200px", width: "100%", user: this.user }));
		const hbox2 = new HBoxElement({ gap: "10px" });
		hbox2.append(new ButtonElement({
			text: "Back", width: "48%", height: "50px", margin: "0 auto", onclick: () => {
				this.card.replaceChild(this.step3(), this.card.children[0]);
			}
		}));
		hbox2.append(new ButtonElement({ text: "Register", width: "48%", height: "50px", margin: "0 auto", onclick: () => this.register() }));
		vbox.append(hbox2);
		return vbox;
	}

	private register() {
		console.log(this.user.toJSON());
		if (this.user.value.password.toString() == this.user.value.confirmPassword.toString()) {
			fetch('https://ipapi.co/json/')
				.then(response => response.json())
				.then(data => {
					const latitude = data.latitude;
					const longitude = data.longitude;
					this.user.value.msg = "";
					const user: any = {
						...this.user.toJSON(), userLocation: {
							"type": "Point",
							"coordinates": [latitude, longitude
							]
						}
					}
					Api.User.register(user).then((msg) => {
						if (msg != "Registration successful") {
							Router.go("#/login", { email: this.user.value.email });
						} else {
							this.user.value.msg = msg;
						}
					});
				})
				.catch(error => console.error('Error fetching IP location:', error));

		}
		else {
			this.user.value.msg = "Passwords do not match";
		}
	}

}