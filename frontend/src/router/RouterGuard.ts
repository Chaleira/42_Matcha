import { RouterGuard } from "typecomposer/dist/esm/core/router/RouterGuard";
import { Api } from "../api/Api";
import { userStore } from "../store/UserStore";

class RouterGuardHome extends RouterGuard {
  constructor() {
    super("login");
  }

  async beforeEach(): Promise<boolean> {
    const user = await Api.User.profile();
    if (user != undefined) userStore.value = user;
    return user != undefined;
  }
}

export const routerGuardHome = new RouterGuardHome();
