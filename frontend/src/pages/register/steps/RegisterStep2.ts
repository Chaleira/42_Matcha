import { IUser } from "@/api/Interfaces";
import { ButtonElement, CardPanel, computed, DropDown, H4Element, HBox, ref, TextField, VBox } from "typecomposer";
import { RegisterStep1 } from "./RegisterStep1";
import { RegisterStep3 } from "./RegisterStep3";




export function RegisterStep2(user: ref<IUser>, card: CardPanel): VBox {
	const validateStep = computed(() => {
		return !(user.value.first_name.value.length > 0 &&
			user.value.last_name.value.length > 0 &&
			user.value.age.value >= 18 && user.value.age.value <= 100 &&
			user.value.gender.value.length > 0 && user.value.sexual_preference.value.length > 0);
	}, [user]);


	const vbox = new VBox({ padding: "10px", gap: "15px" });
	vbox.append(new H4Element({ text: "Register", className: "login_header", }));
	vbox.append(new TextField({ placeholder: "First Name", value: user.value.first_name }));
	vbox.append(new TextField({ placeholder: "Last Name", value: user.value.last_name }));
	vbox.append(new TextField({ type: "number", min: "18", max: "100", placeholder: "Age", value: user.value.age }));
	const hbox1 = new HBox({ gap: "10px" });
	hbox1.append(new DropDown({
		placeholder: "Gender",
		options: ["male", "female"],
		value: user.value.gender,
		width: "48%"
	}));
	hbox1.append(new DropDown({
		placeholder: "Sexual Orientation",
		options: [
			"heterosexual", "homosexual", "bisexual" 
		],
		value: user.value.sexual_preference,
		width: "48%"

	}));
	vbox.append(hbox1);
	const hbox2 = new HBox({ gap: "10px" });
	hbox2.append(new ButtonElement({
		text: "Back", width: "48%", height: "50px", margin: "0 auto", onclick: () => {
			card.replaceChild(RegisterStep1(user, card), card.children[0]);
		}
	}));
	hbox2.append(new ButtonElement({
		disabled: validateStep,
		text: "Next", width: "48%", height: "50px", margin: "0 auto", onclick: () => {
			card.replaceChild(RegisterStep3(user, card), card.children[0]);
		}
	}));
	vbox.append(hbox2);
	return vbox;
}