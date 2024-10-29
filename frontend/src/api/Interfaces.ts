
export interface IUser {
	_id?: string,
	username: string;
	email: string;
	avatar?: string;
	album?: string[];
	password: string;
	dateBirth: Date;
	firstName: string;
	lastName: string;
	bio: string
	tags: string[];
	gender: string;
	sexualOrientation: string;
	userLocation: {
		"type": "Point",
		"coordinates": number[]
	}
	isDeleted?: boolean;
	liked: string[],
	blocked: string[],
	viewd: IUser[],
	matched: IUser[],
}


export interface IMessage {
	sender: string;
	content: string;
	date: Date;
}