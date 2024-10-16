import { userStore } from "@/store/UserStore";
import { Component, DivElement, ImageElement, InputElement, ref, StyleOptional } from "typecomposer";



export class AlbumContainer extends Component {

	private container: DivElement;

	constructor(private props: StyleOptional & {
		user: ref<any>
	}) {
		super({ overflow: "hidden", display: "flex", flexDirection: "column", padding: "0px", ...props });
		this.container = new DivElement({ className: "album-container" });
		this.container.append(this.createAddPhoto());
		this.append(this.container);
		for(const image of props.user.value.album){
			this.createAlbum(new ImageElement({ src: image.toString() }));
		}
	}

	createAlbum(image: ImageElement) {
		const album = new DivElement({ className: "album-item" });
		album.append(image);
		const close = new DivElement({ className: "album-close", text: "❌" });
		close.onclick = () => {
			const index = (this.props.user.value.album as []).findIndex((e: string) => e.toString() == image.src);
			this.props.user.value.album.splice(index, 1);
			album.remove();
		}
		album.append(close);
		this.container.insertBefore(album, this.container.children[this.container.children.length - 1]);
	}

	createAddPhoto() {
		const album = new DivElement({ className: "album-item", display: "block", alignContent: "center", text: "Add Photo", textAlign: "center", cursor: "pointer", border: "1px dashed #000" });
		const input = new InputElement({ type: "file", accept: "image/*", hidden: true, multiple: true });
		album.append(input);
		album.onclick = () => input.click();
		input.onchange = () => {


			const files = input.files;
			if (files) {
				for (let i = 0; i < files.length; i++) {
					const reader = new FileReader();
					reader.onload = (e: any) => {
						console.log(e.target.result);
						this.createAlbum(new ImageElement({ src: e.target.result as string }));
						this.props.user.value.album.push(e.target.result as string);
					};
					reader.readAsDataURL(files[i]);
				}
			}
		}
		return album;
	}
}