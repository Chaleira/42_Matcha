import { GuardResponse, RouterGuard } from "typecomposer";
import { Api } from "../api/Api";
import { userStore } from "../store/UserStore";

export class RouterGuardHome extends RouterGuard {

  async beforeEach(response: GuardResponse) {
    const user = await Api.User.profile();
    console.log(user);
    if (user != undefined) {
      if (userStore.value._id != user._id) {
        userStore.value = user;
      }
      response.resolve();
    }
    response.redirect("login");
  }

}