"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserModel_1 = require("../../model/user/UserModel");
const router = express_1.default.Router();
router.post('/user/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new UserModel_1.UserModel(req.body);
        const user = yield newUser.save();
        res.status(201).json(user);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
router.get('/user/profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
router.put('/user/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
console.log('User controller loaded');
exports.default = router;
