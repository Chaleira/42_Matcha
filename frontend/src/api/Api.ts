

export namespace Api {

	export const URL = "http://localhost:3000/api";

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

		export async function register(username: string, email: string, password: string): Promise<boolean> {
			const myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			const body = JSON.stringify({
				"username": username,
				"email": email,
				"password": password
			});

			return await fetch(`${URL}/user/register`, {
				method: "POST",
				headers: myHeaders,
				body: body,
				redirect: "follow"
			})
				.then(async (response) => {
					if (!response.ok) {
						throw new Error("Invalid registration");
					}
					localStorage.removeItem("token");
					return true;
				}).catch((error) => {
					alert(error);
					return false;
				});
		}

	}


}