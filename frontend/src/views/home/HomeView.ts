import { ButtonElement, Component, GridPanel, HBox, ImageElement, ref, Router, SpanElement, VBox } from "typecomposer";
import { userStore } from "@/store/UserStore";
import { Api } from "@/api/Api";
import { IUser } from "@/api/Interfaces";
import { TagList } from "@/components/TagList";
import { FilterUsers } from "@/components/FilterUsers.ts";

class UserView extends Component {

	constructor(user: IUser) {
		super({ backgroundColor: "white", borderRadius: "5px", boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", maxWidth: "350px", minHeight: "350px", maxHeight: "350px", padding: "10px", overflow: "hidden" });
		const vbox = new VBox({ gap: "5px", padding: "5px", width: "100%" });
		const avatar = new ImageElement({ src: user.avatar || "/assets/image/istockphoto-1337144146-612x612.jpg", maxHeight: "220px" });
		vbox.append(avatar);
		vbox.append(new SpanElement({ text: `${user.first_name} ${user.last_name}`, fontSize: "20px", fontWeight: "bold" }));
		vbox.append(new SpanElement({ text: user.email }));
		const hbox = new HBox({ gap: "5px" });
		TagList.convertTags(user.tags).forEach(tag => hbox.append(TagList.createTag(tag, false, () => { }, undefined)));
		vbox.append(hbox);
		vbox.append(new ButtonElement({ text: "profile", onclick: () => { Router.go("profile", { id: user.user_id }) } }));
		this.append(vbox);
	}
}

export default class HomeView extends Component {

	private grid = new GridPanel({ className: "grid-users", gap: "10px", padding: "10px", width: "100%", columns: "repeat(4, auto)", marginBottom: "50px" });
	params = ref<IUser[]>([], "params");

	constructor() {
		super({ display: "flex", width: "100vw", height: "100vh", overflowX: "hidden", overflowY: "auto", flexDirection: "column" });
		this.append(new FilterUsers(), this.grid);
		this.params.subscribe((items: any) => {
			console.log("items:", items);
			this.grid.innerHTML = "";
			items.forEach((user: IUser) => {
				if (user.user_id != userStore.value.user_id?.toString()) this.grid.append(new UserView(user));
			});
			console.log("params:", items);
		});
	}

	async onInit() {
		this.params.value = await Api.User.list();
	}
}