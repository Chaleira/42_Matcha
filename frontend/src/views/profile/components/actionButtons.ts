import { ButtonElement, Component, DivElement, ImageElement, ref } from "typecomposer";
import { Api } from "@/api/Api";
import { userStore } from "@/store/UserStore";
import { IUser } from "@/api/Interfaces";


export class ActionButtons extends Component {

    private container : DivElement;
    private liked : boolean;
    private blocked : boolean;
    private visible = ref("inline-block");

    constructor(private user: IUser) {
        super({className: "action-buttons-div"});
        this.liked = userStore.value.liked.find(e => e == this.user._id) != undefined;
        this.blocked = userStore.value.blocked.find(e => e == this.user._id) != undefined;
        this.visible.value = this.blocked ? "none" : "inline-block";
        this.container = new DivElement();
        this.createButtons( [
            {name: "message", color: "blue", image: "/assets/image/messenger.png", action: (button : ButtonElement) => {this.msg(button)}, display: this.visible},
            {name: "like",color: this.liked ? "red" : "green", image: "/assets/image/heart.png", action: (button : ButtonElement) => {this.like(button)}, display: this.visible},
            {name: "block",color: this.blocked ? "blue" : "red", image: "/assets/image/block.png", action: (button : ButtonElement) => {this.block(button)}},
            {name: "report",color: "#ffc72a", image: "/assets/image/report.png", action: (button : ButtonElement) => {this.report(button)}}
        ]);
        this.append(this.container);
    }

    createButtons(actions : {name: string, color: string; image: string; action: Function; display?: ref<string>}[]) {

        for (const action of actions){
            const button = new ButtonElement({className: "action-button", backgroundColor: action.color, display: action.display || "absolute"});
            
            button.onclick = () => {action.action(button)}
            button.append(new ImageElement({src: action.image}))
            this.container.append(button)
        }
    }

    block(button : ButtonElement) {
        Api.User.block({
            userBlockingId: userStore.value._id || "",
            userBlockedId: this.user._id || ""
        });
        button.style.backgroundColor = button.style.backgroundColor == "red" ? "blue" : "red";
        this.blocked = !this.blocked;
        this.visible.value = this.blocked ? "none" : "inline-block";
        console.log("this.blocked: " + this.blocked);
        console.log("this.visible: " + this.visible.value);
        console.log("User Blocking ID: " + userStore.value._id + "(" + userStore.value.username + ")"); 
        console.log("User Being Blocked ID: " + this.user._id + "(" + this.user.username + ")");
    }

    like(button : ButtonElement) {
        Api.User.like({
            userLikingId: userStore.value._id || "",
            userBeingLikedId: this.user._id || ""
        });
        button.style.backgroundColor = button.style.backgroundColor == "red" ? "green" : "red";
        console.log("User Liking ID: " + userStore.value._id + "(" + userStore.value.username + ")");
        console.log("User Being Liked ID: " + this.user._id + "(" + this.user.username + ")");
    }

    report(button : ButtonElement) {

    }

    msg(button : ButtonElement) {

    }
}