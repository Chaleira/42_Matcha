import { GuardResponse, RouterGuard } from "typecomposer";
import { Api } from "../api/Api";
import { userStore } from "../store/UserStore";

export class RouterGuardHome extends RouterGuard {

  async beforeEach(response: GuardResponse) {
    const user = await Api.User.profile();
    console.log(user);
    if (user != undefined) {
      if (user?.age == undefined)
        response.redirect("registerprofile");
      else {
        if (userStore.value.id != user.id) {
          userStore.value = user;
        }
        response.resolve();
      }
    }
    response.redirect("login");
  }

}