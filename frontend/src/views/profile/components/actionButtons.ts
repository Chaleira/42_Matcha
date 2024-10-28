import { ButtonElement, Component, DivElement, ImageElement } from "typecomposer";
import { Api } from "@/api/Api";
import { userStore } from "@/store/UserStore";
import { IUser } from "@/api/Interfaces";


export class ActionButtons extends Component {

    private container : DivElement;

    constructor(private user: IUser) {
        super({className: "action-buttons-div"});
        this.container = new DivElement();
        this.createButtons( [
            {color: "blue", image: "/assets/image/messenger.png", action: () => {this.msg()}},
            {color: "green", image: "/assets/image/heart.png", action: () => {this.like()}},
            {color: "red", image: "/assets/image/block.png", action: () => {this.block()}},
            {color: "#ffc72a", image: "/assets/image/report.png", action: () => {this.report()}}
        ]);
        this.append(this.container);
    }

    createButtons(actions : {color: string; image: string; action: Function}[]) {
        for (const action of actions){
            var button = new ButtonElement({className: "action-button", backgroundColor: action.color, onclick: () => {action.action()}});
            button.append(new ImageElement({src: action.image}))
            this.container.append(button)
        }
    }

    block() {
        userStore.value.blocked.push(this.user)
        Api.User.update({
            blocked: userStore.value.blocked
        });
        console.log("MIAU");
    }

    like() {
        if (!userStore.value.liked.includes(this.user))
            userStore.value.liked.push(this.user)
        Api.User.update({
            liked: userStore.value.liked
        });
        console.log("MIAU");
    }

    report() {

    }

    msg() {

    }
}