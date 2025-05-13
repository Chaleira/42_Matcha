
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
	//liked: string[],
	blocked: string[],
	viewd: IUser[],
	matched: IUser[],
	latitude: number,
	longitude: number

}


export interface IMessage {
	sender: string;
	content: string;
	date: Date;
}