import { AlertPanel } from "typecomposer";
import { IChat, IMessage, INotification, IUser } from "./Interfaces";

export namespace Api {

	export const URL = "http://localhost:3000/api";

	Fetch.defaultCredentials = "include";
	Fetch.defaultHeaders = ((): Headers => {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		return myHeaders;
	})();


	export namespace Notification {

		export async function list(): Promise<INotification[]> {
			return await fetch(`${URL}/notification/get`, {
				method: "GET",
				redirect: "follow"
			})
				.then(async (response) => {
					if (!response.ok) {
						return "Invalid registration";
					}
					return (await response.json());
				}).catch((error) => {
					return error;
				});
		}

		export async function update(id: number, value: Partial<INotification>): Promise<INotification> {
			return await fetch(`${URL}/notification/update`, {
				method: "GET",
				redirect: "follow",
				params: { id },
				body: JSON.stringify(value)
			})
				.then(async (response) => {
					if (!response.ok) {
						return "Invalid registration";
					}
					return (await response.json());
				}).catch((error) => {
					return error;
				});
		}
	}

	export namespace Chat {

		export async function list(): Promise<IChat[]> {
			return await fetch(`${URL}/chat/get/user-chats`, {
				method: "GET",
				redirect: "follow"
			})
				.then(async (response) => {
					if (!response.ok) {
						throw new Error("Invalid credentials");
					}
					return await response.json();
				}).catch((error) => {
					console.error(error);
					//alert(error);
					return [];
				});
		}

		export async function get(chatId: string): Promise<{ user_id: string, messages: IMessage[] }> {
			return await fetch(`${URL}/chat/get?chatId=${chatId}`, {
				method: "GET",
				redirect: "follow"
			})
				.then(async (response) => {
					if (!response.ok) {
						throw new Error("Invalid credentials");
					}
					return await response.json();;
				}).catch((error) => {
					alert(error);
					return false;
				});
		}

		export async function create(users: string[]): Promise<string> {
			const body = JSON.stringify({ users: users });
			return await fetch(`${URL}/chat/create`, {
				method: "POST",
				body: body,
				redirect: "follow"
			})
				.then(async (response) => {
					if (!response.ok) {
						return "Invalid registration";
					}
					return (await response.json())?.message;
				}).catch((error) => {
					return error;
				});
		}
	}

	export namespace User {

		export async function login(email: string, password: string): Promise<boolean> {
			const myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");
			const body = JSON.stringify({
				"username": email,
				"password": password
			});

			return await fetch(`${URL}/auth/login`, {
				method: "POST",
				headers: myHeaders,
				body: body,
				redirect: "follow"
			})
				.then(async (response) => {
					if (!response.ok)
						throw new Error((await response.json()).message);
					const { token } = await response.json();
					localStorage.setItem("token", token);
					return true;
				}).catch((error) => {
					AlertPanel.error(error);
					return false;
				});
		}

		export async function logout(): Promise<boolean> {
			return await fetch(`${URL}/auth/logout`, {
				method: "POST",
				redirect: "follow"
			})
				.then(async (response) => {
					if (!response.ok)
						throw new Error((await response.json()).message);
					return true;
				}).catch((error) => {
					AlertPanel.error(error);
					return false;
				});
		}

		export async function register(user: IUser): Promise<{ message: string, ok: boolean }> {
			const myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			const body = JSON.stringify(user);

			return await fetch(`${URL}/auth/register`, {
				method: "POST",
				headers: myHeaders,
				body: body,
				redirect: "follow"
			})
				.then(async (response) => {
					localStorage.removeItem("token");
					if (!response.ok) {
						const { message } = await response.json();
						return { message, ok: response.ok };
					}
					localStorage.removeItem("token");
					return { message: "Registration successful", ok: response.ok };
				}).catch((error) => {
					console.error(error);
					return { message: "Invalid registration", ok: false };
				});
		}

		export async function getLikes(userId: string): Promise<IUser[]> {
			return await fetch(`${URL}/user/profile`, {
				method: "GET",
				redirect: "follow",
				params: userId ? { id: userId } : undefined,
			})
				.then(async (response) => {
					if (!response.ok) {
						throw new Error("Invalid token");
					}
					return await response.json();
				}).catch(() => {
					return null;
				});
		}

		export async function createBlocks(userId: string): Promise<boolean> {
			return await fetch(`${URL}/block/create`, {
				method: "POST",
				redirect: "follow",
				params: { blocked_id: userId },
			}).then(async (response) => {
				return response.ok
			}).catch(() => {
				return false;
			});
		}

		export async function deleteBlocks(userId: string): Promise<boolean> {
			return await fetch(`${URL}/block/delete`, {
				method: "POST",
				redirect: "follow",
				params: { blocked_id: userId },
			}).then(async (response) => {
				return response.ok
			}).catch(() => {
				return false;
			});
		}

		export async function createLike(userId: string): Promise<boolean> {
			return await fetch(`${URL}/like/create`, {
				method: "POST",
				redirect: "follow",
				params: { liked_id: userId },
			}).then(async (response) => {
				return response.ok
			}).catch(() => {
				return false;
			});
		}

		export async function deleteLike(userId: string): Promise<boolean> {
			return await fetch(`${URL}/like/delete`, {
				method: "POST",
				redirect: "follow",
				params: { liked_id: userId },
			}).then(async (response) => {
				return response.ok
			}).catch(() => {
				return false;
			});
		}

		export async function profile(userId?: string): Promise<IUser> {
			return await fetch(`${URL}/user/profile`, {
				method: "GET",
				redirect: "follow",
				params: userId ? { id: userId } : undefined,
			})
				.then(async (response) => {
					if (!response.ok) {
						throw new Error("Invalid token");
					}
					const user = await response.json();
					if (user) {
						user.tags = user.tags || [];
						user.viewd = user.viewd || [];
						user.latitude = user.latitude || 0;
						user.longitude = user.longitude || 0;
						user.avatar = user.avatar || "https://pbs.twimg.com/media/FieRMdBUAAAEzmI?format=jpg&name=medium";
					}
					const clearUser: { [key: string]: any } = {}
					for (const key in user) {
						// @ts-ignore
						if (user[key]) {
							// @ts-ignore
							clearUser[key] = user[key];
						}
					}
					return clearUser as any;
				}).catch(() => {
					AlertPanel.error("Invalid token");
					return null;
				});
		}

		export async function list(params: { [key: string]: any } = {}): Promise<IUser[]> {
			return await fetch(`${URL}/user/list`, {
				method: "POST",
				redirect: "follow",
				body: JSON.stringify(params),
			})
				.then(async (response) => {
					if (!response.ok) {
						throw new Error("Invalid list");
					}
					const data = await response.json();
					return data;
				}).catch(() => {
					return [];
				});
		}

		export async function update(params: { [key: string]: any } = {}): Promise<IUser> {
			delete params?.user_id;
			delete params?.created_at;
			delete params?.viewd;
			const body = JSON.stringify(params);
			return await fetch(`${URL}/user/profile/update`, {
				method: "POST",
				body: body,
				redirect: "follow"
			})
				.then(async (response) => {
					if (!response.ok) {
						throw new Error("Invalid update");
					}
					return await response.json();
				}).catch((error) => {
					AlertPanel.error("Invalid update");
					return error;
				});
		}

		export async function like(params: { userBeingLikedId: string, userLikingId: string }): Promise<IUser> {
			return await fetch(`${URL}/user/like`, {
				method: "POST",
				body: JSON.stringify(params),
				redirect: "follow"
			})
				.then(async (response) => {
					if (!response.ok) {
						throw new Error("Invalid like");
					}
					response.json().then((data) => console.log(data.message));
					return await response.json();
				}).catch((error) => {
					return error;
				});
		}

		export async function sendResetPassword(email: string): Promise<{ message: string }> {
			return await fetch(`${URL}/auth/send-reset-password-email`, {
				method: "GET",
				redirect: "follow",
				params: { email },
			})
				.then(async (response) => {
					if (!response.ok) {
						throw new Error("Invalid token");
					}
					AlertPanel.info("Check your email for the reset password link");
					return await response.json();
				}).catch(() => {
					//alert(error);
					return null;
				});
		}

		export async function resetPassword(token: string, password: string): Promise<{ message: string }> {
			return await fetch(`${URL}/auth/reset-password`, {
				method: "POST",
				redirect: "follow",
				body: JSON.stringify({ password }),
				params: { token },
			})
				.then(async (response) => {
					if (!response.ok) {
						throw new Error("Invalid token");
					}
					return await response.json();
				}).catch(() => {
					return null;
				});
		}

		export async function report(reportedId: string): Promise<void | { message: string } | null> {
			return await fetch(`${URL}/user/report`, {
				method: "POST",
				redirect: "follow",
				params: { reportedId },
			})
				.then(async (response) => {
					response.json().then((data) => {
						if (!response.ok)
							AlertPanel.error(data.message || "Invalid report");
						else
							AlertPanel.info(data.message || "Report sent successfully")
					})
				});
		}
	}


}
