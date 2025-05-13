import { blockService } from "../service/blockService";
import { AuthenticatedRequest } from "../types/request";
import { ValidationError } from "../utils/errors";
import { Response } from "express";

export const blockController = {
	async createBlock(req: AuthenticatedRequest, res: Response) {
		const blockerId = req.user.id;
		const blockedId = parseInt(req.query.blocked_id as string);
		const block = await blockService.createBlock(blockerId, blockedId);
		res.status(201).json(block);
	},
	async getBlocksByBlocker(req: AuthenticatedRequest, res: Response) {
		const blockerId = parseInt(req.query.blocker_id as string);
		const blocks = await blockService.getBlocksByBlocker(blockerId);
		res.status(200).json(blocks);
	},
	async getBlocksByBlocked(req: AuthenticatedRequest, res: Response) {
		const blockedId = parseInt(req.query.blocked_id as string);
		const blocks = await blockService.getBlocksByBlocked(blockedId);
		res.status(200).json(blocks);
	},

	async getBlock(req: AuthenticatedRequest, res: Response) {
		const blockerId = req.user.id;
		const blockedId = parseInt(req.query.user_id as string);
		const block = await blockService.getBlock(blockerId, blockedId);
		res.status(200).json(block);
	},

	async deleteBlock(req: AuthenticatedRequest, res: Response) {
		const blockerId = req.user.id;
		const blockedId = parseInt(req.query.blocked_id as string);
		await blockService.deleteBlock(blockerId, blockedId);
		res.status(204).send();
	},
};