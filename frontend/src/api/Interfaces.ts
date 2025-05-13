
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
	chat_id: number;
	created_at: Date;
	id: number;
	is_read: boolean;
	sender_id: number;
	text: string;
}



export interface IChat {
	id: string;
	user1_id: string;
	user2_id: string;
	created_at: Date;
	first_name: string;
	last_name: string;
	avatar?: string;
}