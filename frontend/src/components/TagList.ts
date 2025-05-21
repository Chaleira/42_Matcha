import { IUser } from "@/api/Interfaces";
import { ButtonElement, DivElement, HBox, PopUpButton, ref } from "typecomposer";

export class TagList extends HBox {


	public static tags: { tag: string, color: string }[] = [
		{ tag: "💑 Dating", color: "#FF69B4" },
		{ tag: "🤝 Friends", color: "#FFD700" },
		{ tag: "🎶 Music", color: "#8A2BE2" },
		{ tag: "✈️ Travel", color: "#00BFFF" },
		{ tag: "🍣 Foodie", color: "#FF6347" },
		{ tag: "🎮 Gamer", color: "#FF4500" },
		{ tag: "🏋️ Fitness", color: "#32CD32" },
		{ tag: "📚 Bookworm", color: "#D2691E" },
		{ tag: "🏞️ Outdoors", color: "#228B22" },
		{ tag: "🎬 Movies", color: "#708090" },
		{ tag: "🐾 Animal", color: "#FFA500" },
		{ tag: "🌍 Adventure", color: "#20B2AA" },
		{ tag: "⚽ Sports", color: "#1E90FF" },
		{ tag: "🎨 ArtL", color: "#DA70D6" },
		{ tag: "💻 Tech", color: "#4682B4" },
		{ tag: "🌳 Nature", color: "#6B8E23" },
		{ tag: "☕ Coffee", color: "#8B4513" },
		{ tag: "💃 Dancer", color: "#FF69B4" },
		{ tag: "🧘 Yogi", color: "#9370DB" },
		{ tag: "💼 Entrepreneur", color: "#708090" }
	];

	constructor(private user: ref<IUser>) {
		super({ display: "flex", gap: "5px", flexWrap: "wrap" });
		const grid = new DivElement({ className: "tag-grid" });
		TagList.tags.forEach(tag => grid.append(this.insertTag(tag)));
		const tag1 = new PopUpButton({ buttonText: "➕", className: "tag-pop", options: [grid], hover: false });
		tag1.buttonIcon.style.textAlign = "center";
		this.append(tag1);
		const buttons = this.querySelectorAll<ButtonElement>("[tag]");
		for (const btn of buttons) {
			if (user.value.tags.includes(btn.getAttribute("tag") || "")) {
				btn.click();
			}
		}
	}

	addTag(tag: ButtonElement, item: { tag: string, color: string }, parant?: HTMLElement) {
		if (parant == undefined) {
			tag.disabled = true;
			this.insertBefore(this.insertTag(item, tag), this.children[this.children.length - 1]);
			this.user.value.tags.push(item.tag);
		} else {
			this.removeChild(tag);
			parant.disabled = false;
			//const index = (this.user.value.tags as []).findIndex((e: string) => e.toString() == item.tag);
			// @ts-ignore
			const tags = this.user.value.tags.value.filter((e: string) => e.toString() != item.tag);
			console.log("tagas", tags);
			this.user.value.tags.value = tags;
			//this.user.value.tags.value.splice(index, 1);
		}
	}

	insertTag(item: { tag: string, color: string }, parant?: HTMLElement): ButtonElement {
		const tag = TagList.createTag(item, true, () => this.addTag(tag, item, parant), parant);
		return tag;
	}

	public static convertTags(tagNames: string[]): { tag: string, color: string }[] {
		const tags: { tag: string, color: string }[] = [];
		TagList.tags.forEach(tag => {
			if (tagNames && tagNames.includes(tag.tag))
				tags.push(tag);
		});
		return tags;
	}

	public static createTag(item: { tag: string, color: string }, isExtend: boolean, onclick: () => void, parant?: HTMLElement): ButtonElement {
		const textTag = isExtend ? item.tag : item.tag.split(" ")[0];

		const tag = new ButtonElement({
			text: textTag, className: "tag", backgroundColor: item.color, onclick: onclick
		});
		tag.setAttribute("tag", item.tag);
		if (isExtend == false)
			tag.title = item.tag.replace(textTag, "").trim();
		return tag;
	}


}