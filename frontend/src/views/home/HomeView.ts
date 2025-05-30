import { ButtonElement, Component, DivElement, GridPanel, HBox, ImageElement, ref, Router, SpanElement, VBox } from "typecomposer";
import { userStore } from "@/store/UserStore";
import { Api } from "@/api/Api";
import { IFilter, IUser } from "@/api/Interfaces";
import { TagList } from "@/components/TagList";
import { FilterUsers } from "@/components/FilterUsers.ts";
import { AppPage } from "@/pages/app/AppPage";

class UserView extends Component {

	status: SpanElement = new SpanElement({
		text: "🔴", position: "absolute", top: "16px", right: "16px",
		title: "Este é um texto de ajuda",
		cursor: "default"
	});

	constructor(private user: IUser) {
		const bkColor = (user.like.i_liked == true) ? "#459900" : "#8b3dff";
		super({ backgroundColor: "white", borderRadius: "5px", boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", maxWidth: "350px", minHeight: "350px", padding: "10px", overflow: "hidden" });
		const vbox = new VBox({ position: "relative", gap: "5px", padding: "5px", width: "100%" });
		const avatar = new ImageElement({ src: user.avatar || "/assets/image/istockphoto-1337144146-612x612.jpg", maxHeight: "220px" });
		vbox.append(this.status);
		vbox.append(avatar);
		vbox.append(new SpanElement({ text: `${user.first_name} ${user.last_name}`, fontSize: "20px", fontWeight: "bold" }));
		vbox.append(new SpanElement({ text: user.email }));
		const div = vbox.appendChild(new DivElement({ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: "5px" }));
		div.append(new SpanElement({ text: "Fame Score: " + user.fame_score?.toString() || "1", fontSize: "16px", fontWeight: "bold" }));
		if (user.like.i_liked == true && user.like.he_liked == true)
			div.append(new SpanElement({ text: "Match: ❤️", fontSize: "16px", fontWeight: "bold" }));
		else if (user.like.he_liked == true)
			div.append(new SpanElement({ text: "Like: 👍", fontSize: "16px", fontWeight: "bold" }));
		const hbox = new HBox({ gap: "5px" });
		TagList.convertTags(user.tags).forEach(tag => hbox.append(TagList.createTag(tag, false, () => { }, undefined)));
		vbox.append(hbox);
		vbox.append(new ButtonElement({ text: "profile", backgroundColor: bkColor, onclick: () => { Router.go("profile", { id: user.user_id }) } }));
		this.append(vbox);
		this.onEvent("user-connected", () => { this.onInit(); });
	}

	onInit(): void {
		const userId = this.user.user_id?.toString() || "";
		const userStatus = AppPage.userStatus.get(userId) || { online: false, userId: userId, username: "", updatedAt: undefined };
		// dia de hoje meio dia
		if (!userStatus.updatedAt) {
			const now = new Date();

			userStatus.updatedAt = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
				12, Math.round(Math.random() * 60), Math.round(Math.random() * 60), 0
			);
		} else if (AppPage.userStatus.has(userId)) {
			userStatus.updatedAt = new Date(userStatus.updatedAt);
		}

		this.status.innerText = userStatus.online ? "🟢" : "🔴";
		this.status.title = userStatus.online ? "Online" : "Offline" + " desde " + userStatus.updatedAt.toLocaleString();
	}

	onDisconnected(): void {
		this.removeEvent("user-connected");
	}
}

export default class HomeView extends Component {

	private grid = new GridPanel({ className: "grid-users", gap: "10px", padding: "10px", width: "100%", columns: "repeat(4, auto)", marginBottom: "50px" });
	private params = ref<IUser[]>([], "params");


	constructor() {
		super({ display: "flex", width: "100vw", height: "100vh", overflowX: "hidden", overflowY: "auto", flexDirection: "column" });
		const filter = this.appendChild(new FilterUsers());
		this.append(this.grid);
		this.params.subscribe((items: any) => {
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
		this.params.value = await Api.User.list(clearFilter);
	}
}