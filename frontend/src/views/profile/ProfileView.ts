import { Api } from "@/api/Api";
import { IUser } from "@/api/Interfaces";
import { TagList } from "@/components/TagList";
import { userStore } from "@/store/UserStore";
import { AlertPanel, AvatarPanel, BorderPanel, ButtonElement, DialogPanel, DivElement, DropDown, GridPanel, H3Element, HBox, ImageElement, ref, Router, TextAreaElement, TextField, VBox } from "typecomposer";
import { ActionButtons } from "./components/actionButtons";
import { AlbumContainer } from "@/components/AlbumContainer";


export class ProfileView extends BorderPanel {

    id: string = "";


    constructor() {
        super({ className: "profile-view" });
        this.onEvent("router:watch", () => this.update());
    }

    async update() {
        if (Router.props.id == this.id) {
            return;
        }
        console.log("ProfileView update", Router.props.id);
        this.id = Router.props.id;
        this.top.innerHTML = "";
        this.center.innerHTML = "";
        this.center.style.maxHeight = "80vh";
        const user: IUser = await Api.User.profile(Router.props.id);
        if (!user) {
            console.error("User not found");
            Router.go("home");
            return;
        }
        const myUser = ref({ ...user, pictures: [] });
        // @ts-ignore
        myUser.value.pictures.value = user?.pictures || [];

        const isMyUser = user.user_id == userStore.value.user_id
        // @ts-ignore
        const avatar = new propertyItem("", isMyUser ? new AvatarPanel({ className: "avatar-profile", srcOut: myUser.value.avatar, src: myUser.value.avatar.valueOf() || "/assets/image/istockphoto-1337144146-612x612.jpg", maxHeight: "150px", maxWidth: "150px", margin: "10px", marginRight: "30px", borderRadius: "50px", cursor: "pointer" })
            : new ImageElement({ className: "avatar-profile", src: myUser.value.avatar || "/assets/image/istockphoto-1337144146-612x612.jpg", width: "min-content", maxHeight: "150px", margin: "20px", marginRight: "30px", borderRadius: "50px", onclick: () => this.openFullScreen(user.avatar?.toString() || "") }));
        const usernameUpdateButton = new DivElement({
            className: "username-update-button",
            flexDirection: !isMyUser ? "column" : "row",
            children: [
                !isMyUser ? new ActionButtons(user) :
                    new ButtonElement({
                        className: "profile-button"
                        , text: "Update Profile", onclick: async () => {
                            const data = myUser.toJSON() as IUser;
							console.log("DATA", data);
                            for (const key in data) {
                                // @ts-ignore
                                if (data[key] == undefined || data[key] == null || data[key] == "") {
                                    // @ts-ignore
                                    delete data[key];
                                }
                            }
                            data.tags = Array.from(new Set(myUser.value.tags.value)) as string[];
                            console.log("myUser.value", data);
                            Api.User.update(data).then(() => {
                                AlertPanel.info("Profile updated");
                            })
                        }
                    }),
                isMyUser ? new ButtonElement({
                    className: "profile-button",
                    text: "Reset Password",
                    onclick: async () => {
                        Api.User.sendResetPassword(myUser.value.email.toString());
                    }
                }) : undefined,
            ].filter((item) => item !== undefined)
        });
        this.top.append(new GridPanel({
            className: "grid-user-info",
            children: [avatar, usernameUpdateButton]
        }));

        const userInfo = new VBox({ overflow: "auto", margin: "10px" });
		const userName = new HBox();
		userName.append(new propertyItem("Name: ", isMyUser ? new TextField({ value: myUser.value.first_name, variant: "underlined" }) : user.first_name));
		userName.append(new propertyItem("", isMyUser ? new TextField({ value: myUser.value.last_name, variant: "underlined" }) : user.last_name));
		userInfo.append(userName);
        // userInfo.append(new propertyItem("Name: ", isMyUser ? new TextField({ value: myUser.value.first_name + " " + myUser.value.last_name, variant: "underlined" }) : user.first_name + " " + user.last_name));
        if (isMyUser) {
            userInfo.append(new propertyItem("Email: ", new TextField({ value: myUser.value.email, variant: "underlined" })));
            userInfo.append(new propertyItem("Latitude: ", new TextField({ value: myUser.value.latitude, variant: "underlined" })));
            userInfo.append(new propertyItem("Longitude: ", new TextField({ value: myUser.value.longitude, variant: "underlined" })));
        }
        else {
            if (user.like.he_liked == true) {
                if (user.like.i_liked.value)
                    userInfo.append(new propertyItem("Match:", "❤️"));
                else
                    userInfo.append(new propertyItem("Like:", "👍"));
            }
        }
        userInfo.append(new propertyItem("Gender: ", isMyUser ? new DropDown({
            options: ["male", "female"],
            value: myUser.value.gender,
            // width: "48%",
            variant: "underlined"
        }) : user.gender));
        userInfo.append(new propertyItem("Sexual Preference: ", isMyUser ? new DropDown({
            options: ["heterosexual", "homosexual", "bisexual" ],
            value: myUser.value.sexual_preference,
            // width: "48%",
            variant: "underlined"
        }) : user.sexual_preference));
		userInfo.append(new propertyItem("Fame Score: ", user.fame_score?.toString() || "1"));
        userInfo.append(new propertyItem("Age: ", user.age.toString()));
        const hbox = new HBox({ gap: "5px" });
        TagList.convertTags(user.tags).forEach(tag => hbox.append(TagList.createTag(tag, false, () => { }, undefined)));
        if (isMyUser) {
            myUser.value.tags.value = user.tags;
        }
        userInfo.append(new propertyItem("Tags: ", isMyUser ? new TagList(myUser) : hbox));
        const bio = userInfo.appendChild(new propertyItem("Bio: ", isMyUser ? new TextAreaElement({ value: myUser.value.bio, width: "100%", height: "100%" }) : user.bio));
        bio.element1.style.marginBottom = 0;
        const album = new HBox({ gap: "20px", width: "100%", marginTop: "0" });
        user.pictures?.forEach(image => album.append(new ImageElement({ src: image, maxHeight: "100px", maxWidth: "100px", onclick: (e) => this.openFullScreen(image) })));
        userInfo.appendChild(new propertyItem("", isMyUser ? new AlbumContainer({ marginTop: "15px", maxHeight: "200px", width: "100%", user: myUser }) : album));
        const div = new DivElement({ maxHeight: "85%", padding: "5px", margin: "10px", backgroundColor: "#808080b2", borderRadius: "20px", backgroundBlendMode: "darken", marginTop: "0px", children: [userInfo], overflow: "auto" });
        this.center.append(div);
    }

    openFullScreen(image: string) {
        const fullScreen = new DialogPanel({ className: "full-screen", zIndex: "10", backgroundColor: "#000000bf", show: "modal", root: "body" });
        const img = new ImageElement({ src: image, maxWidth: "100%", maxHeight: "100%" });
        fullScreen.onClose = () => {
            fullScreen.remove();
        }
        img.onclick = () => fullScreen.close();
        fullScreen.append(img);
        fullScreen.onclick = () => fullScreen.close();
        console.log("clicked");
    }

    onDisconnected(): void {
        this.removeEvent("router:watch");
    }
}

class propertyItem extends HBox {
    element1: IComponent;
    element2: IComponent;
    constructor(label: string, value: string | IComponent) {
        super({ className: "property-item", gap: "10px" });
        if (value === undefined)
            value = "";
        this.element1 = new H3Element({ text: label, color: "white", fontFamily: "initial" });
        this.element2 = typeof value === "string" ? new H3Element({ text: value, color: "black" }) : value;
        this.append(this.element1, this.element2);
    }
}
