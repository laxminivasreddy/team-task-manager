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
// Get all tasks (Admin sees all, Member sees assigned)
router.get('/', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const where = req.user.role === 'ADMIN' ? {} : { assigneeId: req.user.id };
        const tasks = yield prisma_1.prisma.task.findMany({
            where,
            include: {
                project: { select: { id: true, name: true } },
                assignee: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
}));
// Create a task (Admin only)
router.post('/', auth_1.authenticate, auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, projectId, assigneeId, dueDate, status } = req.body;
        if (!title || !projectId) {
            return res.status(400).json({ error: 'Title and projectId are required' });
        }
        const task = yield prisma_1.prisma.task.create({
            data: {
                title,
                description,
                projectId,
                assigneeId,
                dueDate: dueDate ? new Date(dueDate) : null,
                status: status || 'TODO',
            },
            include: {
                assignee: { select: { id: true, name: true } }
            }
        });
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
}));
// Update a task
router.put('/:id', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.id;
        const { title, description, assigneeId, dueDate, status } = req.body;
        const existingTask = yield prisma_1.prisma.task.findUnique({ where: { id: taskId } });
        if (!existingTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        // Members can only update status of their assigned tasks
        if (req.user.role !== 'ADMIN') {
            if (existingTask.assigneeId !== req.user.id) {
                return res.status(403).json({ error: 'Forbidden: Can only update your assigned tasks' });
            }
            const updatedTask = yield prisma_1.prisma.task.update({
                where: { id: taskId },
                data: { status }, // Only status can be updated by member
                include: {
                    assignee: { select: { id: true, name: true } }
                }
            });
            return res.json(updatedTask);
        }
        // Admin can update everything
        const updatedTask = yield prisma_1.prisma.task.update({
            where: { id: taskId },
            data: {
                title,
                description,
                assigneeId,
                status,
                dueDate: dueDate ? new Date(dueDate) : null,
            },
            include: {
                assignee: { select: { id: true, name: true } }
            }
        });
        res.json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
}));
// Delete a task (Admin only)
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.prisma.task.delete({
            where: { id: req.params.id },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
}));
exports.default = router;
