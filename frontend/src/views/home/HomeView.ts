import { Component, GridElement, SpanElement, VBoxElement } from "typecomposer";
import { userStore } from "../../store/UserStore";
import { Api } from "../../api/Api";
import { IUser } from "../../api/Interfaces";


class UserView extends Component {

	constructor(user: IUser) {
		super({ backgroundColor: "red", minWidth: "100px", maxHeight: "250px" });
		const vbox = new VBoxElement({ gap: "5px", padding: "5px" });
		vbox.append(new SpanElement({ text: user.username }));
		vbox.append(new SpanElement({ text: user.email }));
		this.append(vbox);
	}
}

export class HomeView extends Component {

	private grid = new GridElement({ gap: "10px", padding: "10px", width: "100%", height: "100%", columns: "repeat(4, 1fr)" });

	constructor() {
		super({ display: "flex", width: "100%", height: "100%", overflowY: "auto" });
		this.append(this.grid);
		this.update();
	}

	async update() {
		this.grid.innerHTML = "";
		const users = await Api.User.list();
		console.log(users);
		console.log(userStore.value);
		users.forEach((user: IUser) => {
			if (user._id != userStore.value._id?.toString()) this.grid.append(new UserView(user));
		});
	}
}