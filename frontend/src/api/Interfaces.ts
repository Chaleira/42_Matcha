
export interface IUser {
	_id?: string,
	username: string;
	email: string;
	avatar?: string;
	album?: string[];
	password: string;
	age: number;
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
}
