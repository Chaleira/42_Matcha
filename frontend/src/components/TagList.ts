import { ButtonElement, DivElement, HBoxElement, PopUpButton, ref } from "typecomposer";

export class TagList extends HBoxElement {


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

	constructor(private user: ref<any>) {
		super({ display: "flex", gap: "5px", flexWrap: "wrap" });
		const grid = new DivElement({ className: "tag-grid" });
		TagList.tags.forEach(tag => grid.append(this.insertTag(tag)));
		const tag1 = new PopUpButton({ buttonText: "➕", className: "tag-pop", options: [grid], hover: false });
		tag1.buttonIcon.style.textAlign = "center";
		this.append(tag1);
	}

	insertTag(item: { tag: string, color: string }, parant?: HTMLElement): ButtonElement {
		const tag = TagList.createTag(item, true, () => {
			if (parant == undefined) {
				tag.disabled = true;
				this.insertBefore(this.insertTag(item, tag), this.children[this.children.length - 1]);
				this.user.value.tags.push(item.tag);
			} else {
				this.removeChild(tag);
				parant.disabled = false;
				const index = (this.user.value.tags as []).findIndex((e: string) => e.toString() == item.tag);
				this.user.value.tags.splice(index, 1);
			}
		}, parant);
		return tag;
	}

	public static convertTags(tagNames: string[]): { tag: string, color: string }[] {
		const tags: { tag: string, color: string }[] = [];
		TagList.tags.forEach(tag => {
			if (tagNames.includes(tag.tag))
				tags.push(tag);
		});
		return tags;
	}

	public static createTag(item: { tag: string, color: string }, isExtend: boolean, onclick: () => void, parant?: HTMLElement): ButtonElement {
		const textTag = isExtend ? item.tag : item.tag.split(" ")[0];

		const tag = new ButtonElement({
			text: textTag, className: "tag", backgroundColor: item.color, onclick: onclick
		});
		if (isExtend == false)
			tag.title = item.tag.replace(textTag, "").trim();
		return tag;
	}


}