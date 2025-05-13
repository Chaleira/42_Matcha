import { likeService } from "../service/likeService";
import { AuthenticatedRequest } from "../types/request";
import { ValidationError } from "../utils/errors";
import { Response } from "express";

export const likeController = {
	async createLike(req: AuthenticatedRequest, res: Response) {
		const likerId = req.user.id;
		const likedId = parseInt(req.query.liked_id as string);
		const like = await likeService.createLike(likerId, likedId);
		res.status(201).json(like);
	},

	async getLikesByLiker(req: AuthenticatedRequest, res: Response) {
		const likerId = parseInt(req.query.liker_id as string);
		const likes = await likeService.getLikesByLiker(likerId);
		res.status(200).json(likes);
	},

	async getLikesByLiked(req: AuthenticatedRequest, res: Response) {
		const likedId = parseInt(req.query.liked_id as string);
		const likes = await likeService.getLikesByLiked(likedId);
		res.status(200).json(likes);
	},

	async getLike(req: AuthenticatedRequest, res: Response) {
		const likerId = req.user.id;
		const likedId = parseInt(req.query.user_id as string);
		const i_liked = await likeService.findByLikerAndLiked(likerId, likedId);
		const he_liked = await likeService.findByLikerAndLiked(likedId, likerId);
		const like = {i_liked: !!i_liked, he_liked: !!he_liked};
		res.status(200).json(like);
	},

	async deleteLike(req: AuthenticatedRequest, res: Response) {
		const likerId = req.user.id;
		const likedId = parseInt(req.query.liked_id as string);
		await likeService.deleteLike(likerId, likedId);
		res.status(204).send();
	},
};
