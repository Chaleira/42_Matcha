


export interface IUser {
	_id?: string,
	username: string;
	email: string;
	userLocation: {
		"type": "Point",
		"coordinates": number[]
	}
	isDeleted?: boolean;
}