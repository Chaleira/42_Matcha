import { ButtonElement, Component, DivElement, GridPanel, HBox, ImageElement, ref, Router, SpanElement, VBox } from "typecomposer";
import { userStore } from "@/store/UserStore";
import { Api } from "@/api/Api";
import { IFilter, IUser } from "@/api/Interfaces";
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
		const filter = this.appendChild(new FilterUsers());
		this.append(this.grid);
		this.params.subscribe((items: any) => {
			console.log("items:", items);
			this.grid.innerHTML = "";
			items.forEach((user: IUser) => {
				if (user.user_id != userStore.value.user_id?.toString()) this.grid.append(new UserView(user));
			});
		});
		this.listerUsers();
		this.append(new DivElement({
			className: "btn-chat-minimize", position: "fixed", width: "20px", text: "=", onclick: () => {
				filter.classList.toggle("open");
			}
		}));
	}


	async listerUsers(filter?: IFilter) {
		const clearFilter: { [key: string]: any } = {}
		if (filter?.tags && filter.tags.length > 0) {
			clearFilter["tags"] = filter.tags.map((tag: string) => tag.toLowerCase());
		}
		for (const key in filter) {
			// @ts-ignore
			if (filter[key] != "") {
				// @ts-ignore
				clearFilter[key] = filter[key];

			}
		}
		delete clearFilter?.latitude;
		delete clearFilter?.longitude;
		//if (clearFilter?.radius_km == undefined) {
		//	delete clearFilter.latitude;
		//	delete clearFilter.longitude;
		//}
		//else {
		//	clearFilter.latitude = userStore.value.latitude;
		//	clearFilter.longitude = userStore.value.longitude;
		//}
		this.params.value = await Api.User.list(clearFilter);
	}
}