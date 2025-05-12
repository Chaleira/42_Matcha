import { AuthenticatedRequest } from "../types/request";
import { Response } from "express";
import { ValidationError } from "../utils/errors";
import { matchService } from "../service/matchService";

export const matchController = {
	async getMatchesForUser(req: AuthenticatedRequest, res: Response) {
		const matches = await matchService.getMatchesForUser(req.user.id);
		res.status(200).json(matches);
	},

	async getMatch(req: AuthenticatedRequest, res: Response) {
		const user1Id = parseInt(req.query.user1_id as string);
		const user2Id = parseInt(req.query.user2_id as string);
		const match = await matchService.getMatch(user1Id, user2Id);
		res.status(200).json(match);
	},
};
