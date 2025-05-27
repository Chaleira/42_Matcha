import { IUser } from "@/api/Interfaces";
import { ButtonElement, CardPanel, computed, H4Element, ref, TextField, VBox } from "typecomposer";
import { RegisterStep2 } from "./RegisterStep2";

export function RegisterStep1(user: ref<IUser>, card: CardPanel): VBox {
	const confirmPassword = ref<string>("");
	const validateStep1 = computed(() => {
		return !(user.value.username.value.length > 0 &&
			user.value.email.value.length > 0 &&
			user.value.email.value?.includes("@") &&
			user.value.password.value.length > 0 &&
			confirmPassword.value.length > 8 && 
			user.value.password.value == confirmPassword.value);
	}, [user]);

	const vbox = new VBox({ padding: "10px", gap: "15px" });
	vbox.append(new H4Element({ text: "Register", className: "login_header", }));
	vbox.append(new TextField({ placeholder: "Username", label: "Username", value: user.value.username }));
	vbox.append(new TextField({ placeholder: "Email", label: "Email", value: user.value.email }));
	vbox.append(new TextField({ placeholder: "Password", label: "Password", type: "password", value: user.value.password }));
	vbox.append(new TextField({ placeholder: "Confirm password", label: "Confirm password", type: "password", value: confirmPassword }));
	vbox.append(new ButtonElement({
		disabled: validateStep1,
		text: "Next", width: "200px", height: "50px", margin: "0 auto", onclick: () => {
			card.replaceChild(RegisterStep2(user, card), card.children[0]);
		}
	}))

	return vbox;
}