import {
  AlertPanel,
  ButtonElement,
  Component,
  computed,
  DivElement,
  ImageElement,
  InputElement,
  ref,
  refBoolean,
  refString,
  Router,
} from "typecomposer";
import { Api } from "@/api/Api";
import { IUser } from "@/api/Interfaces";

export class ActionButtons extends Component {
  private container: DivElement;
  private userRef: ref<IUser>;

  constructor(private user: IUser) {
    super({ className: "action-buttons-div" });
    this.userRef = ref(user);
    this.container = new DivElement();
    this.createButtons([
      {
        name: "message",
        color: "blue",
        image: "/assets/image/messenger.png",
        action: () => {
          this.msg();
        },
        hidden: computed(
          () =>
            !(
              this.userRef.value.like.i_liked.value &&
              this.userRef.value.like.he_liked.value
            ),
          [this.userRef]
        ),
      },
      {
        name: "like",
        color: computed(
          () => (this.userRef.value.like.i_liked.value ? "green" : "red"),
          [this.userRef]
        ),
        image: "/assets/image/heart.png",
        action: () => this.like(),
        hidden: computed(
          () => this.userRef.value.block.i_blocked.value == true,
          [this.userRef]
        ),
      },
      {
        name: "block",
        color: computed(
          () => (this.userRef.value.block.i_blocked.value ? "red" : "blue"),
          [this.userRef]
        ),
        image: "/assets/image/block.png",
        action: () => this.block(),
      },
      {
        name: "report",
        color: "#ffc72a",
        image: "/assets/image/report.png",
        action: () => {
          this.report();
        },
      },
    ]);
    this.append(this.container);
  }

  createButtons(
    actions: {
      name: string;
      color: string | refString;
      image: string;
      action: Function;
      hidden?: ref<boolean> | refBoolean;
    }[]
  ) {
    for (const action of actions) {
      const button = new ButtonElement({
        className: "action-button",
        backgroundColor: action.color,
        hidden: action.hidden || false,
      });
      button.onclick = () => action.action(button);
      button.append(new ImageElement({ src: action.image }));
      this.container.append(button);
    }
  }

  block() {
    if (!this.userRef.value.block.i_blocked.value)
      Api.User.createBlocks(this.user.user_id || "");
    else Api.User.deleteBlocks(this.user.user_id || "");
    this.userRef.value.block.i_blocked.value =
      !this.userRef.value.block.i_blocked.value;
  }

  async like() {
    if (!this.userRef.value.like.i_liked.value) {
		const res = await Api.User.createLike(this.user.user_id || "");
		console.log(res);
		if (res)
			this.userRef.value.like.i_liked.value = !this.userRef.value.like.i_liked.value;
	}
    else {
		Api.User.deleteLike(this.user.user_id || "");
		this.userRef.value.like.i_liked.value = !this.userRef.value.like.i_liked.value;
	}
  }

  async report() {
    const res = await Api.User.report(
      this.user.user_id || "",
    );
    if (res)
      AlertPanel.info(
        "Thank you for reporting this user. We will review the report and take appropriate action if necessary."
      );
  }

  msg() {
    Router.go("/chat");
  }
}
