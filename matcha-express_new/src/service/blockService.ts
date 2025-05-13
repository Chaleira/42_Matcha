import { blockModel, IBlock } from "../model/blockModel";
import { userService } from "../service/userService";
import { likeService } from "../service/likeService";
import { NotFoundError, ValidationError } from "../utils/errors";
import mapDbError from "../utils/mapDbError";

export const blockService = {
	async createBlock(blockerId: number, blockedId: number): Promise<IBlock> {
		try {
			const existingLike = await likeService.findByLikerAndLiked(blockerId, blockedId);
			if (existingLike) await likeService.deleteLike(blockerId, blockedId);
			const block = await blockModel.create({ blocker_id: blockerId, blocked_id: blockedId });
			return block;
		} catch (error: any) {
			throw mapDbError.block(error);
		}
	},

	async findByBlockerAndBlocked(blockerId: number, blockedId: number): Promise<IBlock | null> {
		try {
			const block = await blockModel.findByBlockerAndBlocked(blockerId, blockedId);
			return block;
		} catch (error: any) {
			throw mapDbError.block(error);
		}
	},

	async getBlocksByBlocker(blockerId: number): Promise<IBlock[] | null> {
		try {
			const existingUser = await userService.getUserById(blockerId);
			if (!existingUser) throw new NotFoundError("User not found");
			const blocks = await blockModel.findByBlocker(blockerId);
			return blocks;
		} catch (error: any) {
			throw mapDbError.block(error);
		}
	},

	async getBlocksByBlocked(blockedId: number): Promise<IBlock[] | null> {
		try {
			const existingUser = await userService.getUserById(blockedId);
			if (!existingUser) throw new NotFoundError("User not found");
			const blocks = await blockModel.findByBlocked(blockedId);
			return blocks;
		} catch (error: any) {
			throw mapDbError.block(error);
		}
	},
	async deleteBlock(blockerId: number, blockedId: number): Promise<void> {
		try {
			const block = await blockModel.findByBlockerAndBlocked(blockerId, blockedId);
			if (!block) throw new NotFoundError("Block not found");
			await blockModel.delete(blockerId, blockedId);
		} catch (error: any) {
			throw mapDbError.block(error);
		}
	}
};