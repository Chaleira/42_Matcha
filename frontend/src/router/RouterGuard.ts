import { GuardResponse, RouterGuard } from "typecomposer";
import { Api } from "../api/Api";
import { userStore } from "../store/UserStore";

export class RouterGuardHome extends RouterGuard {

  async beforeEach(response: GuardResponse) {
    const user = await Api.User.profile();
    console.log(user);
    if (user != undefined) {
      if (userStore.value.user_id != user.user_id) {
        userStore.value = user;
      }
      response.resolve();
    }
    response.redirect("login");
  }

}