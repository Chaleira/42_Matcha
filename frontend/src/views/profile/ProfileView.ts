import { Api } from "@/api/Api";
import { IUser } from "@/api/Interfaces";
import { AlbumContainer } from "@/components/AlbumContainer";
import { TagList } from "@/components/TagList";
import { userStore } from "@/store/UserStore";
import { AvatarElement, BorderPaneElement, ButtonElement, Component, DialogPane, DivElement, DropDown, H1Element, H3Element, HBoxElement, IComponent, ImageElement, Router, TextAreaElement, TextFieldElement, VBoxElement } from "typecomposer";
import { ActionButtons } from "./components/actionButtons";




export class ProfileView extends BorderPaneElement {

    fullScreen = new DialogPane({ className: "full-screen", zIndex: "10", backgroundColor: "#000000bf" })
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
        const user: IUser = users[0];
        const isMyUser = user._id == userStore.value._id

        const avatar = new propertyItem("", isMyUser ? new AvatarElement({ className: "avatar-profile", src: user.avatar || "/assets/image/istockphoto-1337144146-612x612.jpg", maxHeight: "150px", maxWidth: "150px", margin: "10px", marginRight: "30px", borderRadius: "50px", cursor: "pointer" })
            : new ImageElement({ className: "avatar-profile", src: user.avatar || "/assets/image/istockphoto-1337144146-612x612.jpg", maxHeight: "150px", maxWidth: "150px", margin: "20px", marginRight: "30px", borderRadius: "50px", onclick: () => this.openFullScreen(<string>user.avatar) }));
        const usernameUpdateButton = new VBoxElement({});
        usernameUpdateButton.append(new H1Element({ text: user.username.toUpperCase() || "NAME", color: "black", marginTop: "30px", textAlign: "center", marginBottom: "5px" }));
        if (user._id == userStore.value._id)
            usernameUpdateButton.append(new ButtonElement({ width: "150px", height: "50px", text: "Update Profile" }))
        this.top.append(new HBoxElement({ justifyContent: "flex", width: "100%", children: [avatar, usernameUpdateButton] }));

        if (!isMyUser) {
            const buttonDiv = new ActionButtons(user);
            this.append(buttonDiv);
        }

        const userInfo = new VBoxElement({ overflow: "auto", margin: "20px" });
        userInfo.append(new propertyItem("Name: ", isMyUser ? new TextFieldElement({ text: user.firstName + " " + user.lastName, variant: "underlined" }) : user.firstName + " " + user.lastName));
        userInfo.append(new propertyItem("Gender: ", isMyUser ? new DropDown({
            options: ["male", "female", "develop"],
            value: userStore.value.gender,
            variant: "underlined"
        }) : user.gender));
        userInfo.append(new propertyItem("Sexual Preference: ", isMyUser ? new DropDown({
            options: ["heterosexual", "Viado"],
            value: userStore.value.sexualOrientation,
            variant: "underlined"
        }) : user.sexualOrientation));
        const formattedDate = new Date(user.dateBirth).toLocaleDateString("en-GB");
        userInfo.append(new propertyItem("Birthday: ", formattedDate));
        const hbox = new HBoxElement({ gap: "5px" });
        TagList.convertTags(user.tags).forEach(tag => hbox.append(TagList.createTag(tag, false, () => { }, undefined)));
        userInfo.append(new propertyItem("Tags: ", isMyUser ? new TagList(userStore) : hbox));
        const bio = userInfo.appendChild(new propertyItem("Bio: ", isMyUser ? new TextAreaElement({ text: user.bio, width: "100%", height: "100%" }) : user.bio));
        bio.element1.style.marginBottom = 0;
        const album = new HBoxElement({ gap: "20px", width: "100%", marginTop: "0" });
        user.album?.forEach(image => album.append(new ImageElement({ src: image, maxHeight: "100px", maxWidth: "100px", onclick: () => this.openFullScreen(image) })));
        userInfo.appendChild(new propertyItem("", isMyUser ? new AlbumContainer({ marginTop: "15px", maxHeight: "200px", width: "100%", user: userStore }) : album));
        const div = new DivElement({ maxHeight: "85%", padding: "5px", margin: "20px", backgroundColor: "#808080b2", borderRadius: "20px", backgroundBlendMode: "darken", marginTop: "0px", children: [userInfo], overflow: "auto" });
        this.center.append(div);
    }

    openFullScreen(image: string) {
        const img = new ImageElement({ src: image, maxWidth: "100%", maxHeight: "100" });
        this.fullScreen.content.append(img);
        this.fullScreen.show();
        this.fullScreen.onclick = () => this.closeFullScreen(img);
        this.fullScreen.style.display = "flex";
        this.fullScreen.content.style["justify-content"] = "center";
        this.fullScreen.content.style.padding = "0";
        this.fullScreen.content.style.height = "";
        this.fullScreen.content.style.width = "";
        this.fullScreen.content.style.maxWidth = "60%";
        this.fullScreen.content.style.maxHeight = "60%";
        console.log("clicked");
    }

    closeFullScreen(img: ImageElement) {
        this.fullScreen.content.removeChild(img);
    }
}

class propertyItem extends HBoxElement {
    element1: IComponent;
    element2: IComponent;
    constructor(label: string, value: string | IComponent) {
        super({ className: "property-item", gap: "10px" });
        if (value === undefined)
            value = "";
        this.element2 = typeof value === "string" ? new H3Element({ text: value, color: "black" }) : value;
        this.element1 = new H3Element({ text: label, color: "white", fontFamily: "initial" });
        if (label != "") this.append(this.element1);
        this.append(this.element2);
    }
}

