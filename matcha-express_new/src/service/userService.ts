import { profileModel, IProfile } from "../model/profileModel";
import { likeService } from "./likeService";
import { blockService } from "./blockService";
import { userModel, IUser } from "../model/userModel";
import { Condition, ConditionOperator } from "../database/sqlHelper";
import { NotFoundError, ValidationError } from "../utils/errors";
import mapDbError from "../utils/mapDbError";

export interface UserSearchFilters {
	name?: string;
	gender?: string;
	sexual_preference?: string;
	fame_min?: number;
	tags?: string[];
	latitude?: number;
	longitude?: number;
	radius_km?: number;
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
			return userProfile;
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
			const conditions: Condition[] = [];

			const anyProvided = filters.latitude || filters.longitude || filters.radius_km;
			const allProvided = filters.latitude && filters.longitude && filters.radius_km;
			if (anyProvided && !allProvided) throw new ValidationError("Latitude, longitude, and radius_km must all be provided together.");

			if (filters.gender) conditions.push({ column: "gender", operator: "=" as ConditionOperator, value: filters.gender });

			if (filters.sexual_preference) conditions.push({ column: "sexual_preference", operator: "=" as ConditionOperator, value: filters.sexual_preference });

			if (typeof filters.fame_min === "number") conditions.push({ column: "fame_score", operator: ">" as ConditionOperator, value: filters.fame_min });

			if (filters.tags && filters.tags.length > 0) conditions.push({ column: "tags", operator: "&&" as ConditionOperator, value: filters.tags });

			if (filters.name) conditions.push({ column: "first_name || ' ' || last_name", operator: "ILIKE" as ConditionOperator, value: `%${filters.name}%` });

			if (allProvided) {
				conditions.push({
					column: `6371 * acos(
						cos(radians(${filters.latitude})) * cos(radians(profiles.latitude)) *
						cos(radians(profiles.longitude) - radians(${filters.longitude})) +
						sin(radians(${filters.latitude})) * sin(radians(profiles.latitude))
						)`,
					operator: "<=",
					value: filters.radius_km,
				});
			}

			return await profileModel.listWithFilter(conditions);
		} catch (error: any) {
			throw mapDbError.user(error);
		}
	},
};
