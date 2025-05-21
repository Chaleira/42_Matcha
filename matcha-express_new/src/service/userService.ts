import { profileModel, IProfile } from "../model/profileModel";
import { likeService } from "./likeService";
import { notificationService } from "./notificationService";
import { blockService } from "./blockService";
import { userModel, IUser } from "../model/userModel";
import { Condition, ConditionOperator } from "../database/sqlHelper";
import { NotFoundError, ValidationError } from "../utils/errors";
import mapDbError from "../utils/mapDbError";
import crypto from "crypto";
import nodemailer from "nodemailer";
export interface UserSearchFilters {
	currentUserId: number;
	age_min?: number;
	age_max?: number;
	fame_min?: number;
	fame_max?: number;
	tags?: string[];
	latitude?: number;
	longitude?: number;
	radius_km?: number;
	order_by?: string;
}

export const userService = {
	async createUser(user: IUser): Promise<IUser> {
		try {
			const existingUser = await userModel.findByUsername(user.username);
			if (existingUser) throw new ValidationError("Username already exists");

			const createdUser = await userModel.create(user);

			if (!createdUser.id) throw new ValidationError("Failed to create user");
			await profileModel.create({ user_id: createdUser.id });

			return createdUser;
		} catch (error: any) {
			throw mapDbError.user(error);
		}
	},

	async getUserByEmail(email: string): Promise<IUser | null> {
		try {
			const user = await userModel.findByEmail(email);
			if (!user) throw new NotFoundError("User not found");
			return user;
		} catch (error: any) {
			throw mapDbError.user(error);
		}
	},

	async getUserByUsername(username: string): Promise<IUser | null> {
		try {
			const user = await userModel.findByUsername(username);
			if (!user) throw new NotFoundError("User not found");
			return user;
		} catch (error: any) {
			throw mapDbError.user(error);
		}
	},

	async authFind(username: string): Promise<IUser | null> {
		try {
			const user = await userModel.authFind(username);
			return user || null;
		} catch (error: any) {
			throw mapDbError.user(error);
		}
	},

	generateUserToken(user: IUser): string {
		try {
			const token = userModel.generateToken(user);
			return token;
		} catch (error: any) {
			throw mapDbError.user(error);
		}
	},

	async getUserById(userId: number): Promise<IUser | null> {
		try {
			const user = await userModel.findById(userId);
			if (!user) throw new NotFoundError("User not found");
			return user;
		} catch (error: any) {
			throw mapDbError.user(error);
		}
	},

	async getUserProfile(myId: number, userId: number): Promise<IProfile | null> {
		try {
			const userProfile = await profileModel.findByUserId(userId);
			if (!userProfile) throw new NotFoundError("User profile not found");
			if (myId === userId) return userProfile;
			const like = await likeService.getLike(myId, userId);
			userProfile.like = like;
			const block = await blockService.getBlock(myId, userId);
			userProfile.block = block;
			const user = await profileModel.findByUserId(myId);
			await notificationService.createNotification(userId, myId, "visit", `${user?.first_name} ${user?.last_name} visited your profile`);
			return userProfile;
		} catch (error: any) {
			throw mapDbError.user(error);
		}
	},

	async updateUser(userId: number, updates: Partial<IUser>): Promise<IUser> {
		try {
			const user = await userModel.findById(userId);
			if (!user) throw new NotFoundError("User not found");
			return await userModel.update(userId, updates);
		} catch (error: any) {
			throw mapDbError.user(error);
		}
	},

	async updateUserProfile(userId: number, updates: Partial<IProfile>): Promise<IProfile> {
		try {
			const userProfile = await profileModel.findByUserId(userId);
			if (!userProfile) throw new NotFoundError("User profile not found");
			return await profileModel.update(userId, updates);
		} catch (error: any) {
			throw mapDbError.user(error);
		}
	},

	async deleteUser(userId: number): Promise<void> {
		try {
			const userProfile = await userModel.findById(userId);
			if (!userProfile) throw new NotFoundError("User profile not found");

			await userModel.delete(userId);
		} catch (error: any) {
			throw mapDbError.user(error);
		}
	},

	async listUsers(filters: UserSearchFilters): Promise<IProfile[] | null> {
		try {
			const user = await profileModel.findByUserId(filters.currentUserId);
			if (!user) throw new NotFoundError("User profile not found");
			filters.radius_km = filters.radius_km || 30;
			filters.tags = filters.tags;
			filters.latitude = user.latitude;
			filters.longitude = user.longitude;
			const conditions: Condition[] = getBaseConditions();
			conditions.push(...getMatchConditions({ gender: user?.gender, preference: user?.sexual_preference }));
			conditions.push(...getFiltersConditions(filters));

			return await profileModel.listWithFilter(conditions, { id: filters.currentUserId, latitude: user.latitude!, longitude: user.longitude!, tags: user.tags! }, filters.order_by);
		} catch (error: any) {
			throw mapDbError.user(error);
		}
	},
};

function getFiltersConditions(filters: UserSearchFilters): Condition[] {
	const conditions: Condition[] = [];

	if (filters?.currentUserId) conditions.push({ column: "user_id", operator: "!=" as ConditionOperator, value: filters.currentUserId });

	if (filters?.age_min) conditions.push({ column: "age", operator: ">=" as ConditionOperator, value: filters.age_min });

	if (filters?.age_max) conditions.push({ column: "age", operator: "<=" as ConditionOperator, value: filters.age_max });

	if (filters?.fame_min) conditions.push({ column: "fame_score", operator: ">=" as ConditionOperator, value: filters.fame_min });

	if (filters?.fame_max) conditions.push({ column: "fame_score", operator: "<=" as ConditionOperator, value: filters.fame_max });

	if (filters?.tags && filters?.tags?.length > 0) conditions.push({ column: "tags", operator: "&&" as ConditionOperator, value: filters.tags });

	conditions.push({
		column: `6371 * acos(
					LEAST(1.0, GREATEST(-1.0,
					cos(radians(${filters.latitude})) * cos(radians(profiles.latitude)) *
					cos(radians(profiles.longitude) - radians(${filters.longitude})) +
					sin(radians(${filters.latitude})) * sin(radians(profiles.latitude))
					))
				)`,
		operator: "<=",
		value: filters.radius_km,
	});
	return conditions;
}

function getBaseConditions(): Condition[] {
	return [{ column: "users.email_verified", operator: "=" as ConditionOperator, value: true }];
}

function getMatchConditions(user: { gender: string | undefined; preference: string | undefined }): Condition[] {
	const oppositeGender = user.gender === "male" ? "female" : "male";

	if (user.preference && user.preference === "heterosexual") {
		return [
			{ column: "gender", operator: "=" as ConditionOperator, value: oppositeGender },
			{ column: "sexual_preference", operator: "IN" as ConditionOperator, value: ["heterosexual", "bisexual"] },
		];
	}
	if (user.preference && user.preference === "homosexual") {
		return [
			{ column: "gender", operator: "=" as ConditionOperator, value: user.gender },
			{ column: "sexual_preference", operator: "IN" as ConditionOperator, value: ["homosexual", "bisexual"] },
		];
	}
	return [
		{ column: "gender", operator: "IN" as ConditionOperator, value: ["male", "female"] },
		{ column: "sexual_preference", operator: "IN" as ConditionOperator, value: ["bisexual", "heterosexual", "homosexual"] }, // or refine based on gender
	];
}
