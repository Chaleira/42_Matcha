import { ButtonElement, Component, DivElement, GridElement, HBoxElement, ImageElement, Router, SpanElement, VBoxElement } from "typecomposer";
import { userStore } from "@/store/UserStore";
import { Api } from "@/api/Api";
import { IUser } from "@/api/Interfaces";
import { TagList } from "@/components/TagList";


class UserView extends Component {

	constructor(user: IUser) {
		super({ backgroundColor: "white", borderRadius: "5px", boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", maxWidth: "350px", minHeight: "350px", maxHeight: "350px", padding: "10px", overflow: "hidden" });
		const vbox = new VBoxElement({ gap: "5px", padding: "5px", width: "100%" });
		const avatar = new ImageElement({ src: user.avatar || "/assets/image/istockphoto-1337144146-612x612.jpg", maxHeight: "220px" });
		vbox.append(avatar);
		vbox.append(new SpanElement({ text: user.firstName || "name" }));
		vbox.append(new SpanElement({ text: user.email }));
		const hbox = new HBoxElement({ gap: "5px" });
		TagList.convertTags(user.tags).forEach(tag => hbox.append(TagList.createTag(tag, false, () => { }, undefined)));
		//hbox.append(TagList.createTag(TagList.tags[0], false, () => { }, undefined));
		//hbox.append(TagList.createTag(TagList.tags[1], false, () => { }, undefined));
		//hbox.append(TagList.createTag(TagList.tags[2], false, () => { }, undefined));
		vbox.append(hbox);
		vbox.append(new ButtonElement({ text: "profile", onclick: () => { Router.go("#/profile", {id: user._id})} }));
		this.append(vbox);
	}
}

export class HomeView extends Component {

	private grid = new GridElement({ gap: "10px", padding: "10px", width: "100%", columns: "repeat(4, auto)", marginBottom: "50px" });

	constructor() {
		super({ display: "flex", width: "100vw", height: "100vh", overflowX: "hidden", overflowY: "auto", flexDirection: "column" });
		const divFilter = new DivElement({
			padding: "10px",
			display: "flex", justifyContent: "flex-start", alignItems: "center",
			width: "auto", minHeight: "50px", margin: "10px", marginRight: "10px", marginLeft: "10px", backgroundColor: "white", boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.1)"
		});
		divFilter.append(new SpanElement({ text: "Filter" }));
		this.append(divFilter, this.grid);
		this.update();
	}

	async update() {
		this.grid.innerHTML = "";
		const users = await Api.User.list();
		users.forEach((user: IUser) => {
			if (user._id != userStore.value._id?.toString()) this.grid.append(new UserView(user));
		});
	}
}