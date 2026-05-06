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
// Get all projects
router.get('/', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield prisma_1.prisma.project.findMany({
            include: {
                owner: { select: { id: true, name: true, email: true } },
                _count: { select: { tasks: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
}));
// Get single project
router.get('/:id', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield prisma_1.prisma.project.findUnique({
            where: { id: req.params.id },
            include: {
                owner: { select: { id: true, name: true, email: true } },
                tasks: {
                    include: { assignee: { select: { id: true, name: true } } },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
}));
// Create project (Admin only)
router.post('/', auth_1.authenticate, auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Project name is required' });
        }
        const project = yield prisma_1.prisma.project.create({
            data: {
                name,
                description,
                ownerId: req.user.id,
            },
        });
        res.status(201).json(project);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
}));
// Update project (Admin only)
router.put('/:id', auth_1.authenticate, auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        const project = yield prisma_1.prisma.project.update({
            where: { id: req.params.id },
            data: { name, description },
        });
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update project' });
    }
}));
// Delete project (Admin only)
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.prisma.project.delete({
            where: { id: req.params.id },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
}));
exports.default = router;
