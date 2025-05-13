import { IMatch, matchModel } from "../model/matchModel";
import { userService } from "../service/userService";
import { chatService } from "../service/chatService";
import { NotFoundError } from "../utils/errors";
import mapDbError from "../utils/mapDbError";

export const matchService = {
	async createMatch(user1Id: number, user2Id: number): Promise<IMatch> {
		try {
			const match = await matchModel.create(user1Id, user2Id);
			await chatService.createChat(user1Id, user2Id);
			return match;
		} catch (error: any) {
			throw mapDbError.match(error);
		}
	},
	async deleteMatch(user1Id: number, user2Id: number): Promise<void> {
		try {
			const match = await matchModel.getMatch(user1Id, user2Id);
			if (!match) throw new NotFoundError("Match not found");
			await chatService.deleteChat(user1Id, user2Id);
			await matchModel.delete(user1Id, user2Id);
		} catch (error: any) {
			throw mapDbError.match(error);
		}
	},

	async getMatchesForUser(userId: number): Promise<IMatch[] | null> {
		try {
			const user = await userService.getUserById(userId);
			if (!user) throw new NotFoundError("User not found");
			const matches = await matchModel.getMatchesForUser(userId);
			return matches;
		} catch (error: any) {
			throw mapDbError.match(error);
		}
	},

	async getMatch(user1Id: number, user2Id: number): Promise<IMatch | null> {
		try {
			const match = await matchModel.getMatch(user1Id, user2Id);
			return match;
		} catch (error: any) {
			throw mapDbError.match(error);
		}
	},
};
