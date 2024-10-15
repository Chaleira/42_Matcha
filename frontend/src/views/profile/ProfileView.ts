import { Api } from "@/api/Api";
import { IUser } from "@/api/Interfaces";
import { TagList } from "@/components/TagList";
import { Component, H1Element, H3Element, HBoxElement, IComponent, ImageElement, Router, VBoxElement } from "typecomposer";




export class ProfileView extends Component {

  
    constructor() {
        super({ className: "profile-view" });
        // this.innerText = "ProfileView";
        this.update();
    }

	async update() {
		const users = await Api.User.list({ _id: Router.props.id });
        if (users.length != 1) {
            console.error("User not found");
            Router.go("#/home");
            return;
        }
        const user:IUser = users[0];
        const avatar = new ImageElement({ src: user.avatar || "/assets/image/istockphoto-1337144146-612x612.jpg", maxHeight: "250px" , maxWidth: "250px", });
		const vbox = new VBoxElement({ gap: "5px", padding: "20px", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" });
        vbox.append(avatar);
        vbox.append(new H1Element({ text: user.username.toUpperCase() || "NAME",  margin: "0", color: "black"}));
        const div = new VBoxElement({backgroundColor: "#808080b2", width: "100%", height: "100%", padding: "20px", borderRadius: "20px", backgroundBlendMode: "darken"})
        div.append(new propertyItem("Name: ", user.firstName + " " + user.lastName));
        div.append(new propertyItem("Gender: ", user.gender.toUpperCase()));
        div.append(new propertyItem("Sexual Preference: ", user.sexualOrientation.toUpperCase()));
        const formattedDate = new Date(user.dateBirth).toLocaleDateString("en-GB");
        div.append(new propertyItem("Birthday: ", formattedDate));
		const hbox = new HBoxElement({ gap: "5px" });
        TagList.convertTags(user.tags).forEach(tag => hbox.append(TagList.createTag(tag, false, () => { }, undefined)));
        vbox.append(div);
        div.append(new propertyItem("Tags: ", hbox));
        const bio = div.appendChild(new propertyItem("Bio: ", user.bio));
        bio.element1.style.marginBottom = 0;
        bio.element2.style.marginTop = 0;
        const album = new HBoxElement({ gap: "20px", width: "100%"});
        user.album?.forEach(image => album.append(new ImageElement({ src: image, maxHeight: "100px", maxWidth: "100px" })));
        const el = div.appendChild(new propertyItem("Photos: ", album));
        el.element1.style.marginBottom = 0;
        this.append(vbox);
        console.log("users: ", users);
	}

}

class propertyItem extends HBoxElement {
    element1 : IComponent;
    element2 : IComponent;
    constructor(label: string, value: string | IComponent) {
        super({ className: "property-item", gap: "10px" });
        if (value === undefined)
                value = "";
        this.element1 = new H3Element({text: label, color: "white", fontFamily: "initial"});
        this.element2 = typeof value === "string" ? new H3Element({text: value, color: "black"}) : value;
        this.append(this.element1,  this.element2);
    }
}

