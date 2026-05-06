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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const where = role === 'ADMIN' ? {} : { assigneeId: userId };
        const tasks = yield prisma_1.prisma.task.findMany({ where });
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'DONE').length;
        const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
        const todoTasks = tasks.filter(t => t.status === 'TODO').length;
        const now = new Date();
        const overdueTasks = tasks.filter(t => t.status !== 'DONE' && t.dueDate && new Date(t.dueDate) < now).length;
        res.json({
            totalTasks,
            completedTasks,
            inProgressTasks,
            todoTasks,
            overdueTasks
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
}));
exports.default = router;
