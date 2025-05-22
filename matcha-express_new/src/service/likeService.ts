import { ILike, likeModel } from "../model/likeModel";
import { matchService } from "../service/matchService";
import { blockService } from "./blockService";
import { userService } from "../service/userService";
import { NotFoundError, ValidationError } from "../utils/errors";
import mapDbError from "../utils/mapDbError";
import { notificationService } from "./notificationService";

export const likeService = {
	async createLike(likerId: number, likedId: number): Promise<ILike> {
		try {
			const existingBlock = await blockService.findByBlockerAndBlocked(likerId, likedId);
			const existingBlockReverse = await blockService.findByBlockerAndBlocked(likedId, likerId);
			if (existingBlockReverse || existingBlock) throw new ValidationError("You cannot like a blocked user");

			const liker = await userService.getUserProfile(likerId, likerId);
			if (!liker?.avatar) throw new ValidationError("You need to upload an avatar before liking someone");
			const like = await likeModel.create({ liker_id: likerId, liked_id: likedId });

			const checkMatch = await likeModel.findByLikerAndLiked(likedId, likerId);
			if (checkMatch) await matchService.createMatch(likerId, likedId);
			const likedProfile = await userService.getUserProfile(likedId, likedId);
			await userService.updateUserProfile(likedId, { fame_score: likedProfile!.fame_score! + 5 > 100 ? 100 : likedProfile!.fame_score! + 5 });
			await notificationService.createNotification(likedId, likerId, "like", `${liker?.first_name} ${liker?.last_name} liked you!`);
			return like;
		} catch (error: any) {
			throw mapDbError.like(error);
		}
	},

	async findByLikerAndLiked(likerId: number, likedId: number): Promise<ILike | null> {
		try {
			const like = await likeModel.findByLikerAndLiked(likerId, likedId);
			return like;
		} catch (error: any) {
			throw mapDbError.like(error);
		}
	},

	async getLikesByLiker(likerId: number): Promise<ILike[] | null> {
		try {
			const existisUser = await userService.getUserById(likerId);
			if (!existisUser) throw new NotFoundError("User not found");
			const likes = await likeModel.findByLiker(likerId);
			return likes;
		} catch (error: any) {
			throw mapDbError.like(error);
		}
	},

	async getLikesByLiked(likedId: number): Promise<ILike[] | null> {
		try {
			const existisUser = await userService.getUserById(likedId);
			if (!existisUser) throw new NotFoundError("User not found");
			const likes = await likeModel.findByLiked(likedId);
			return likes;
		} catch (error: any) {
			throw mapDbError.like(error);
		}
	},

	async getLike(likerId: number, likedId: number): Promise<{ i_liked: boolean; he_liked: boolean }> {
		try {
			const existisUser = await userService.getUserById(likerId);
			if (!existisUser) throw new NotFoundError("User not found");
			const i_liked = await likeModel.findByLikerAndLiked(likerId, likedId);
			const he_liked = await likeModel.findByLikerAndLiked(likedId, likerId);
			return { i_liked: !!i_liked, he_liked: !!he_liked };
		} catch (error: any) {
			throw mapDbError.like(error);
		}
	},

	async deleteLike(likerId: number, likedId: number): Promise<void> {
		try {
			const like = await likeModel.findByLikerAndLiked(likerId, likedId);
			if (!like) throw new NotFoundError("Like not found");
			const checkMatch = await matchService.getMatch(likerId, likedId);
			if (checkMatch) await matchService.deleteMatch(likerId, likedId);
			const likedProfile = await userService.getUserProfile(likedId, likedId);
			const likerProfile = await userService.getUserProfile(likerId, likerId);
			await userService.updateUserProfile(likedId, { fame_score: likedProfile!.fame_score! - 5 < 1 ? 1 : likedProfile!.fame_score! - 5 });
			await notificationService.createNotification(likedId, likerId, "unlike", `${likerProfile?.first_name} ${likerProfile?.last_name} unliked you!`);
			await likeModel.delete(likerId, likedId);
		} catch (error: any) {
			throw mapDbError.like(error);
		}
	},
};
