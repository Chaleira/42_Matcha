"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserController_1 = __importDefault(require("./controller/user/UserController"));
const app = (0, express_1.default)();
const port = 3000;
// Middleware
app.use(express_1.default.json());
app.use('/api', UserController_1.default);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Connect to MongoDB
mongoose_1.default.connect('mongodb+srv://zequielzico:Vox9KeRE4lmy5sZH@matcha.rp96o.mongodb.net/matcha')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
// Server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
});
exports.default = app;
