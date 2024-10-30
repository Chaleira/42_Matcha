import { IMessage, IUser } from "./Interfaces";

export namespace Api {

	export const URL = "http://localhost:3000/api";

	export function ApiHeader(): Headers {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
		return myHeaders;
	}


	export namespace Chat {

		export async function list(userId: string): Promise<{ _id: string, title: string, icon: string }[]> {
			return await fetch(`${URL}/chat/list?userId=${userId}`, {
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

		export async function get(chatId: string): Promise<{ _id: string, messages: IMessage[] }> {
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
			const myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			const body = JSON.stringify({
				"email": email,
				"password": password
			});

			return await fetch(`${URL}/user/login`, {
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

		export async function profile(): Promise<IUser> {
			return await fetch(`${URL}/user/profile`, {
				method: "GET",
				headers: ApiHeader(),
				redirect: "follow"
			})
				.then(async (response) => {
					if (!response.ok) {
						throw new Error("Invalid token");
					}
					return await response.json();
				}).catch((error) => {
					alert(error);
					return null;
				});
		}

		export async function list(filter: { [key: string]: any } = {}): Promise<IUser[]> {
			const urlParams = new URLSearchParams();
			for (const key in filter) {
				urlParams.append(key, filter[key]);
			}
			return await fetch(`${URL}/user/list?${urlParams.toString()}`, {
				method: "GET",
				headers: ApiHeader(),
				redirect: "follow"
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
			return await fetch(`${URL}/user/update`, {
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

		export async function block(params: { userBlockingId: string, userBlockedId: string }): Promise<IUser> {
			return await fetch(`${URL}/user/block`, {
				method: "POST",
				headers: ApiHeader(),
				body: JSON.stringify(params),
				redirect: "follow"
			})
				.then(async (response) => {
					if (!response.ok) {
						throw new Error("Invalid block");
					}
					response.json().then((data) => console.log(data.message));
					return await response.json();
				}).catch((error) => {
					return error;
				});
		}
	}
}
