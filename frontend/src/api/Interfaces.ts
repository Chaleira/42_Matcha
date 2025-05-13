
export interface IUser {
	user_id?: string,
	username: string;
	email: string;
	avatar?: string;
	album?: string[];
	password: string;
	dateBirth: Date;
	first_name: string;
	last_name: string;
	bio: string
	tags: string[];
	gender: string;
	sexualOrientation: string;
	isDeleted?: boolean;
	viewd: IUser[],
	matched: IUser[],
	latitude: number,
	longitude: number,
	like: {
		i_liked: boolean,
		he_liked: boolean
	},
	block: {
		i_blocked: boolean,
		he_blocked: boolean
	}
}


export interface IMessage {
	sender: string;
	content: string;
	date: Date;
}