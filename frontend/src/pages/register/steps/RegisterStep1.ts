import { IUser } from "@/api/Interfaces";
import { ButtonElement, CardPanel, computed, H4Element, ref, SpanElement, TextField, VBox } from "typecomposer";
import { RegisterStep2 } from "./RegisterStep2";
import common from "@/assets/10k-most-common.json"

export function RegisterStep1(user: ref<IUser>, card: CardPanel): VBox {
	const confirmPassword = ref<string>("");
	const validateStep1 = computed(() => {
		const email = user.value.email.value.toString().trim();
		const username = user.value.username.value.toString().trim();
		const password = user.value.password.value.toString().trim();
		const confirmPasswordValue = confirmPassword.value.toString().trim();
		console.log("Validating step 1", email, username, password, confirmPasswordValue);
		console.log("Validating step 1", common.words.includes(user.value.password.value));
		return !(username.length > 0 &&
			email.length > 0 &&
			email.includes("@") &&
			password.length > 0 &&
			confirmPasswordValue.length > 8 &&
			common.words.includes(confirmPasswordValue.toLowerCase()) == false &&
			password == confirmPasswordValue);
	}, [user, confirmPassword]);

	const vbox = new VBox({ padding: "10px", gap: "15px" });
	vbox.append(new H4Element({ text: "Register", className: "login_header", }));
	vbox.append(new TextField({ placeholder: "Username", label: "Username", value: user.value.username }));
	vbox.append(new TextField({ placeholder: "Email", type: "email", label: "Email", value: user.value.email }));
	vbox.append(new TextField({ placeholder: "Password", label: "Password", type: "password", value: user.value.password, minLength: 12, maxLength: 20 }));
	vbox.append(new TextField({ placeholder: "Confirm password", label: "Confirm password", type: "password", value: confirmPassword, minLength: 12, maxLength: 20 }));
	vbox.append(new SpanElement({
		text: "password must be at least 12 characters long and not a common word.",
	}))
	vbox.append(new ButtonElement({
		disabled: validateStep1,
		text: "Next", width: "200px", height: "50px", margin: "0 auto", onclick: () => {
			card.replaceChild(RegisterStep2(user, card), card.children[0]);
		}
	}))

	return vbox;
}