import { AnchorElement, AvatarElement, ButtonElement, CardElement, Component, DivElement, DropDown, H4Element, HBoxElement, InputElement, PopUpButton, ref, Router, SpanElement, TextAreaElement, TextFieldElement, VBoxElement } from "typecomposer";
import { Api } from "../../api/Api";
import { AlbumContainer } from "../../components/AlbumContainer";


class TagItems extends HBoxElement {

	tags: { tag: string, color: string }[] = [
		{ tag: "💑 Dating", color: "#FF69B4" },
		{ tag: "🤝 Friendship", color: "#FFD700" },
		{ tag: "🎶 MusicLover", color: "#8A2BE2" },
		{ tag: "✈️ TravelAddict", color: "#00BFFF" },
		{ tag: "🍣 Foodie", color: "#FF6347" },
		{ tag: "🎮 Gamer", color: "#FF4500" },
		{ tag: "🏋️ Fitness", color: "#32CD32" },
		{ tag: "📚 Bookworm", color: "#D2691E" },
		{ tag: "🏞️ Outdoors", color: "#228B22" },
		{ tag: "🎬 Movies", color: "#708090" },
		{ tag: "🐾 AnimalLover", color: "#FFA500" },
		{ tag: "🌍 AdventureSeeker", color: "#20B2AA" },
		{ tag: "⚽ SportsFan", color: "#1E90FF" },
		{ tag: "🎨 ArtLover", color: "#DA70D6" },
		{ tag: "💻 TechGeek", color: "#4682B4" },
		{ tag: "🌳 NatureLover", color: "#6B8E23" },
		{ tag: "☕ CoffeeLover", color: "#8B4513" },
		{ tag: "💃 Dancer", color: "#FF69B4" },
		{ tag: "🧘 Yogi", color: "#9370DB" },
		{ tag: "💼 Entrepreneur", color: "#708090" }
	];

	constructor(private user: ref<any>) {
		super({ display: "flex", gap: "5px", flexWrap: "wrap" });
		const grid = new DivElement({ className: "tag-grid" });
		this.tags.forEach(tag => grid.append(this.createTag(tag)));
		const tag1 = new PopUpButton({ buttonText: "➕", className: "tag-pop", options: [grid], hover: false });
		tag1.buttonIcon.style.textAlign = "center";
		this.append(tag1);
	}

	createTag(item: { tag: string, color: string }, parant?: HTMLElement): ButtonElement {
		const tag = new ButtonElement({
			text: item.tag, className: "tag", backgroundColor: item.color, onclick: () => {
				if (parant == undefined) {
					tag.disabled = true;
					this.insertBefore(this.createTag(item, tag), this.children[this.children.length - 1]);
					this.user.value.tags.push(item.tag);
				} else {
					this.removeChild(tag);
					parant.disabled = false;
					const index = (this.user.value.tags as []).findIndex((e: string) => e.toString() == item.tag);
					this.user.value.tags.splice(index, 1);
				}
			}
		});
		return tag;
	}
}

export class RegisterPage extends Component {

	user = ref({
		username: "", email: "", password: "", confirmPassword: "", avatar: "", msg: "", albums: [], dateBirth: new Date().toISOString(),
		firstName: "", lastName: "", bio: "w", tags: [], gender: "male", sexualOrientation: "heterosexual"
	});
	private card = new CardElement({ width: "450px" });

	constructor() {
		super({ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" });
		this.card.append(this.step1());
		const vbox = new VBoxElement({ padding: "10px", gap: "15px" });
		const div = new DivElement({ display: "flex", justifyContent: "space-between" });
		div.append(new AnchorElement({ text: "login", rlink: "#/login" }));
		div.append(new AnchorElement({ text: "forgot password?", rlink: "#/forgot" }));
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
		vbox.append(new SpanElement({ text: this.user.value.msg, color: "red" }));
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
		vbox.append(new SpanElement({ text: this.user.value.msg, color: "red" }));
		vbox.append(new ButtonElement({
			text: "Next", width: "200px", height: "50px", margin: "0 auto", onclick: () => {
				this.card.replaceChild(this.step3(), this.card.children[0]);
			}
		}));
		return vbox;
	}

	private step3(): VBoxElement {
		const vbox = new VBoxElement({ padding: "10px", gap: "15px" });
		vbox.append(new SpanElement({ text: "Bio" }));
		vbox.append(new TextAreaElement({ text: "Register", className: "login_header", height: "100px", value: this.user.value.bio }));
		vbox.append(new SpanElement({ text: "Tags" }));
		vbox.append(new TagItems(this.user));
		vbox.append(new ButtonElement({
			text: "Next", width: "200px", height: "50px", margin: "0 auto", onclick: () => {
				this.card.replaceChild(this.step4(), this.card.children[0]);
			}
		}));
		return vbox;
	}

	private step4(): VBoxElement {
		const vbox = new VBoxElement({ padding: "10px", gap: "15px" });
		vbox.append(new SpanElement({ text: "Avatar" }));
		vbox.append(new AvatarElement({}));
		vbox.append(new SpanElement({ text: "Album" }));
		vbox.append(new AlbumContainer({ maxHeight: "200px", width: "100%", user: this.user }));
		vbox.append(new ButtonElement({ text: "Register", width: "200px", height: "50px", margin: "0 auto", onclick: () => this.register() }));
		return vbox;
	}

	private register() {
		console.log(this.user.toJSON().albums);
		//if (this.user.value.password.toString() == this.user.value.confirmPassword.toString()) {
		//	this.user.value.msg = "";
		//	Api.User.register(this.user.value.username, this.user.value.email, this.user.value.password).then((msg) => {
		//		if (msg != "Registration successful") {
		//			Router.go("#/login", { email: this.user.value.email });
		//		} else {
		//			this.user.value.msg = msg;
		//		}
		//	});
		//}
		//else {
		//	this.user.value.msg = "Passwords do not match";
		//}
	}

}