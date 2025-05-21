import { LabelElement, refBoolean } from "typecomposer";

export class CustomCheckbox extends LabelElement {


	constructor(private label: string, private checked: refBoolean) {
		super({ className: "custom-checkbox" });
	}

	template(): HTMLElement {
		return (
			<>
				<input value={true} name="tes" type="checkbox" checked={this.checked.value}
					oninput={(e) => {
						const target = e.target as HTMLInputElement;
						this.checked.value = target.checked;
					}}
				/>
				<span></span>
				<label>
					{this.label}
				</label>
			</>
		)
	}
}