import { IChat, IMessage, IUser } from "./Interfaces";

export namespace Api {

	export const URL = "http://localhost:3000/api";

	export function ApiHeader(): Headers {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
		return myHeaders;
	}

	export namespace Chat {

		export async function list(): Promise<IChat[]> {
			//console.log("list", localStorage.getItem("token"));
			return await fetch(`${URL}/chat/get/user-chats`, {
				method: "GET",
				headers: Api.ApiHeader(),
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
				headers: Api.ApiHeader(),
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
			console.log(body);
			return await fetch(`${URL}/chat/create`, {
				method: "POST",
				headers: Api.ApiHeader(),
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
			console.log(email, password);
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
					if (!response.ok) {
						throw new Error("Invalid credentials");
					}
					const { token } = await response.json();
					console.log(token);
					localStorage.setItem("token", token);
					return true;
				}).catch((error) => {
					alert(error);
					return false;
				});
		}

		export async function register(user: IUser): Promise<string> {
			console.log(user);
			const myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			const body = JSON.stringify(user);

			return await fetch(`${URL}/user/register`, {
				method: "POST",
				headers: myHeaders,
				body: body,
				redirect: "follow"
			})
				.then(async (response) => {
					if (!response.ok) {
						return "Invalid registration";
					}
					localStorage.removeItem("token");
					return "Registration successful";
				}).catch((error) => {
					return error;
				});
		}

		// /like/get?user_id=59
		export async function getLikes(userId: string): Promise<IUser[]> {
			return await fetch(`${URL}/user/profile`, {
				method: "GET",
				headers: ApiHeader(),
				redirect: "follow",
				params: userId ? { id: userId } : undefined,
			})
				.then(async (response) => {
					if (!response.ok) {
						throw new Error("Invalid token");
					}
					return await response.json();
				}).catch((error) => {
					//alert(error);
					return null;
				});
		}

		export async function createBlocks(userId: string): Promise<boolean> {
			return await fetch(`${URL}/block/create`, {
				method: "POST",
				headers: ApiHeader(),
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
				headers: ApiHeader(),
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
				headers: ApiHeader(),
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
				headers: ApiHeader(),
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
				headers: ApiHeader(),
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
						user.avatar = user.avatar || "https://pbs.twimg.com/media/FieRMdBUAAAEzmI?format=jpg&name=medium";
					}
					return user
				}).catch((error) => {
					//alert(error);
					return null;
				});
		}

		export async function list(params: { [key: string]: any } = {}): Promise<IUser[]> {
			return await fetch(`${URL}/user/list`, {
				method: "GET",
				headers: ApiHeader(),
				redirect: "follow",
				params,
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
			const body = JSON.stringify(params);
			return await fetch(`${URL}/user/profile/update`, {
				method: "POST",
				headers: ApiHeader(),
				body: body,
				redirect: "follow"
			})
				.then(async (response) => {
					if (!response.ok) {
						throw new Error("Invalid update");
					}
					return await response.json();
				}).catch((error) => {
					return error;
				});
		}

		export async function like(params: { userBeingLikedId: string, userLikingId: string }): Promise<IUser> {
			return await fetch(`${URL}/user/like`, {
				method: "POST",
				headers: ApiHeader(),
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

		//export async function block(params: { userBlockingId: string, userBlockedId: string }): Promise<IUser> {
		//	return await fetch(`${URL}/user/block`, {
		//		method: "POST",
		//		headers: ApiHeader(),
		//		body: JSON.stringify(params),
		//		redirect: "follow"
		//	})
		//		.then(async (response) => {
		//			if (!response.ok) {
		//				throw new Error("Invalid block");
		//			}
		//			response.json().then((data) => console.log(data.message));
		//			return await response.json();
		//		}).catch((error) => {
		//			return error;
		//		});
		//}
	}
}
