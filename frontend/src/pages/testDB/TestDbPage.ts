import { AnchorElement, ButtonElement, CardPanel, Component, DivElement, ref, VBox } from "typecomposer";
import { DataBase, WebSocketSyncAdapter } from "indexed-db-adapter";
//import { DataBase, TableStore } from "./db/DataBase";
//import { WebSocketSyncAdapter } from "./db/adapter";



const db = new DataBase("testDB", { syncAdapter: WebSocketSyncAdapter, version: 1 });

//class UserTable extends TableStore {

//	constructor(public id: number, public name: string) {
//		super()
//	}

//}

//class ChatTable extends TableStore {

//	//constructor() {
//	//	super("chat");
//	//}
//}

//db.addTable(UserTable);
//db.addTable(ChatTable);


//db.listen(() => {
//	console.log("DB sucess: ", db.online);
//	//db.synchronize();
//	//usuarios.add({ id: 1, name: "test" });
//});


export class TestDbPage extends Component {

	test = ref({
		name: "test",
		id: 1,
		n: ""
	})

	constructor() {
		super();
		this.append(new DivElement({ className: "background" }));
		const card = new CardPanel({ width: "400px", zIndex: "2" });
		const vbox = new VBox({ padding: "10px", gap: "15px" });

		vbox.append(new ButtonElement({ text: "Login", width: "200px", height: "50px", margin: "0 auto", onclick: () => this.login() }));
		vbox.append(new ButtonElement({ text: "Get", width: "200px", height: "50px", margin: "0 auto", onclick: () => this.get() }));
		//vbox.append(new ButtonElement({ text: "synchronize", width: "200px", height: "50px", margin: "0 auto", onclick: () => db.synchronize() }));

		const div = new DivElement({ display: "flex", justifyContent: "space-between" });
		div.append(new AnchorElement({ text: this.test.value.n, rlink: "register", zIndex: "" }));
		div.append(new AnchorElement({ text: "forgot password?", rlink: "forgot" }));
		vbox.append(div);
		card.append(vbox);
		this.append(card);
	}

	count = 2;

	private async login() {
		this.test.value.n.value = "";
		console.log("test: ", this.test.toJSON());
		//const user: UserTable = new UserTable(this.count, "test_" + this.count);

		//await user.save();
		////await UserTable.put({ name: ("test_" + this.count), id: this.count })
		//console.log("user: ", user, "key:", user.getKey());
		////user.name = "meu teste";
		////console.log("save: ", await user.save());
		//this.count++;

	}

	private async get() {
		//// @ts-ignore
		//const user: UserTable = await UserTable.get(2);
		//console.log("user:get: ", user);
		////user.name = "meu teste";
		////console.log("save: ", await user.save());
		//this.count++;

	}
}
