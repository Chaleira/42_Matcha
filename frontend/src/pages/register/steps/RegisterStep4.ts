import { IUser } from "@/api/Interfaces";
import { AlertPanel, AvatarPanel, ButtonElement, CardPanel, HBox, ref, Router, SpanElement, VBox } from "typecomposer";
import { RegisterStep3 } from "./RegisterStep3";
import { Api } from "@/api/Api";




export function RegisterStep4(user: ref<IUser>, card: CardPanel): VBox {

	const vbox = new VBox({ padding: "10px", gap: "15px" });
	vbox.append(new SpanElement({ text: "Avatar" }));
	vbox.append(new AvatarPanel({ src: user.value.avatar }));

	const hbox2 = new HBox({ gap: "10px" });
	hbox2.append(new ButtonElement({
		text: "Back", width: "48%", height: "50px", margin: "0 auto", onclick: () => {
			card.replaceChild(RegisterStep3(user, card), card.children[0]);
		}
	}));
	hbox2.append(new ButtonElement({
		text: "Register", width: "48%", height: "50px", margin: "0 auto", onclick: () => {
			const data = user.toJSON();
			delete data?.latitude;
			delete data?.longitude;
			// @ts-ignore
			delete data?.block;
			// @ts-ignore
			delete data?.like;
			delete data?.id;
			delete data?.created_at;
			delete data?.email_verified;
			// @ts-ignore
			delete data?.user_id;
			Api.User.register(data).then((data) => {
				if (data.ok) {
					Router.go("login");
				} else {
					AlertPanel.warning(data.message);
				}
			});

		}
	}));
	vbox.append(hbox2);
	return vbox;
}