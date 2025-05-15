import { IUser } from "@/api/Interfaces";
import { ButtonElement, CardPanel, computed, HBox, ref, SpanElement, TextAreaElement, VBox } from "typecomposer";
import { TagList } from "@/components/TagList";
import { RegisterStep2 } from "./RegisterStep2";
import { RegisterStep4 } from "./RegisterStep4";

export function RegisterStep3(user: ref<IUser>, card: CardPanel): VBox {
	const validateStep = computed(() => {
		return !(user.value.bio.value.length > 0 &&
			user.value.tags.value.length > 0);
	}, [user]);

	const vbox = new VBox({ padding: "10px", gap: "15px" });
	vbox.append(new SpanElement({ text: "Bio" }));
	vbox.append(new TextAreaElement({ text: "Register", className: "login_header", height: "100px", value: user.value.bio }));
	vbox.append(new SpanElement({ text: "Tags" }));
	vbox.append(new TagList(user));
	const hbox2 = new HBox({ gap: "10px" });
	hbox2.append(new ButtonElement({
		text: "Back", width: "48%", height: "50px", margin: "0 auto", onclick: () => {
			card.replaceChild(RegisterStep2(user, card), card.children[0]);
		}
	}));
	hbox2.append(new ButtonElement({
		disabled: validateStep,
		text: "Next", width: "48%", height: "50px", margin: "0 auto", onclick: () => {
			card.replaceChild(RegisterStep4(user, card), card.children[0]);
		}
	}));
	vbox.append(hbox2);

	return vbox;
}