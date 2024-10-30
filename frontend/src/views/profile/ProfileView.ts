import { Api } from "@/api/Api";
import { IUser } from "@/api/Interfaces";
import { AlbumContainer } from "@/components/AlbumContainer";
import { TagList } from "@/components/TagList";
import { userStore } from "@/store/UserStore";
import { AvatarElement, ButtonElement, Component, DialogPanel, DropDown, H1Element, H3Element, HBoxElement, ImageElement, Router, TextAreaElement, TextFieldElement, VBoxElement } from "typecomposer";
import { ActionButtons } from "./components/actionButtons";




export class ProfileView extends Component {

    fullScreen = new DialogPanel({className: "full-screen", zIndex: "10", backgroundColor: "#000000bf"})
    constructor() {
        super({ className: "profile-view" });
        this.update();
        this.append(this.fullScreen);

    }

	async update() {
		const users = await Api.User.list({ _id: Router.props.id });
        if (users.length != 1) {
            console.error("User not found");
            Router.go("#/home");
            return;
        }
        const user:IUser = users[0];
        const isMyUser = user._id == userStore.value._id

        const avatar = new propertyItem("", isMyUser ? new AvatarElement({className: "avatar-profile", src: user.avatar || "/assets/image/istockphoto-1337144146-612x612.jpg", maxHeight: "250px" , maxWidth: "250px", margin: "20px", marginRight: "30px", borderRadius: "50px", cursor: "pointer"})
                                        : new ImageElement({className: "avatar-profile", src: user.avatar || "/assets/image/istockphoto-1337144146-612x612.jpg", maxHeight: "250px" , maxWidth: "250px", margin: "20px", marginRight: "30px", borderRadius: "50px", onclick: () => this.openFullScreen(<string>user.avatar)}));
        const headerDiv = new HBoxElement({justifyContent: "flex", width: "100%"});
        headerDiv.append(avatar);

        const usernameUpdateButton = new VBoxElement({justifyContent: "flex", width: "fill", height: "fill", position: "relative"});
        if (user._id == userStore.value._id)
            usernameUpdateButton.append(new ButtonElement({position: "absolute", bottom: "50px", width: "150px", height: "50px", text: "Update Profile", onclick: () => this.updateProfile()}));
        usernameUpdateButton.append(new H1Element({ text: user.username.toUpperCase() || "NAME", color: "black", marginTop: "30px"}))
        headerDiv.append(usernameUpdateButton);

        if (!isMyUser){
            const buttonDiv = new ActionButtons(user);
            this.append(buttonDiv);
        }
     
        const userInfo = new VBoxElement({backgroundColor: "#808080b2", width: "100%", height: "100%", padding: "20px", borderRadius: "20px", backgroundBlendMode: "darken", display: "flex"})
        const fullName = new HBoxElement({ gap: "5px", width: "100%" });
        fullName.append(new propertyItem("Name: ", isMyUser ? new TextFieldElement({value: userStore.value.firstName, variant: "underlined"}) : user.firstName));
        fullName.append(new propertyItem("", isMyUser ? new TextFieldElement({value: userStore.value.lastName, variant: "underlined"}) : user.lastName));
        userInfo.append(fullName);
        userInfo.append(new propertyItem("Gender: ", isMyUser ? new DropDown({
			options: ["male", "female", "develop"],
			value: userStore.value.gender,
			// width: "48%",
            variant: "underlined"
		}) : user.gender));
        userInfo.append(new propertyItem("Sexual Preference: ", isMyUser ? new DropDown({
			options: ["heterosexual", "Viado"],
			value: userStore.value.sexualOrientation,
			// width: "48%",
            variant: "underlined"
		}) : user.sexualOrientation));
        const formattedDate = new Date(user.dateBirth).toLocaleDateString("en-GB");
        userInfo.append(new propertyItem("Birthday: ", formattedDate));
		const hbox = new HBoxElement({ gap: "5px" });
        TagList.convertTags(user.tags).forEach(tag => hbox.append(TagList.createTag(tag, false, () => { }, undefined)));
        userInfo.append(new propertyItem("Tags: ", isMyUser ? new TagList(userStore) : hbox));
        const bio = userInfo.appendChild(new propertyItem("Bio: ", isMyUser ? new TextAreaElement({value: userStore.value.bio, width: "100%", height: "100%"}) : user.bio));
        bio.element1.style.marginBottom = 0;
        const album = new HBoxElement({ gap: "20px", width: "100%", marginTop: "40px"});
        user.album?.forEach(image => album.append(new ImageElement({ src: image, maxHeight: "100px", maxWidth: "100px", onclick: () => this.openFullScreen(image)})));
            userInfo.appendChild(new propertyItem("", isMyUser ? new AlbumContainer({ marginTop: "20px", maxHeight: "200px", width: "100%", user: userStore }) : album));
		
        const vbox = new VBoxElement({ gap: "5px", padding: "20px", width: "100%", height: "100%", justifyContent: "center", alignItems: "left"});
        vbox.append(headerDiv);
        vbox.append(userInfo);
        this.append(vbox);
	}

    openFullScreen(image :string){
      
        const img = new ImageElement({src: image, maxWidth: "1000px", maxHeight: "1000px"});
        this.fullScreen.content = img;
        this.fullScreen.style.display = "flex";
        this.fullScreen.show();
        this.fullScreen.onclick = () => {this.fullScreen.style.display = "none"};
        console.log("clicked");
    }

    updateProfile() {
        console.log(userStore.toJSON());
        Api.User.update(userStore.toJSON());
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
