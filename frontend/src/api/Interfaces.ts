
export interface IUser {
	id?: number;
	user_id: string;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	password: string;
	email_verified?: boolean;
	age: number;
	bio: string;
	tags: string[];
	gender: string;
	sexual_preference: string;
	pictures: string[];
	avatar: string;
	fame_score?: number;
	latitude?: number;
	longitude?: number;
	like: {
		i_liked: boolean;
		he_liked: boolean;
	},
	block: {
		i_blocked: boolean;
		he_blocked: boolean;
	},
	created_at?: Date;
}

export interface IFilter {
	name: string;
	gender: string;
	sexual_preference: string;
	fame_min: number;
	fame_max: number;
	tags: string[];
	latitude: number;
	longitude: number;
	radius_km: number;
	age_min: number;
	age_max: number;
	order_by: "distance" | "fame_score" | "age" | "shared_tags";
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

export type NotificationType = 'match' | 'like' | 'visit' | 'message' | 'unlike';

export interface INotification {
	id?: number,
	user_id: number,
	triggered_by_id: number,
	type: NotificationType;
	content: string,
	seen: boolean,
	created_at?: string
}