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
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Seeding database...');
        // Create users
        const adminPassword = yield bcryptjs_1.default.hash('password123', 10);
        const memberPassword = yield bcryptjs_1.default.hash('password123', 10);
        const admin = yield prisma.user.upsert({
            where: { email: 'admin@taskmanager.com' },
            update: {},
            create: {
                email: 'admin@taskmanager.com',
                name: 'Admin User',
                password: adminPassword,
                role: 'ADMIN',
            },
        });
        const member = yield prisma.user.upsert({
            where: { email: 'member@taskmanager.com' },
            update: {},
            create: {
                email: 'member@taskmanager.com',
                name: 'Team Member',
                password: memberPassword,
                role: 'MEMBER',
            },
        });
        // Create Projects
        const project1 = yield prisma.project.create({
            data: {
                name: 'Website Redesign',
                description: 'Overhauling the company corporate website with a modern design.',
                ownerId: admin.id,
            },
        });
        const project2 = yield prisma.project.create({
            data: {
                name: 'Mobile App Launch',
                description: 'Final testing and deployment for the new iOS and Android application.',
                ownerId: admin.id,
            },
        });
        // Create Tasks
        yield prisma.task.createMany({
            data: [
                {
                    title: 'Design UI Mockups',
                    description: 'Create high-fidelity mockups for the homepage and about page.',
                    status: 'DONE',
                    projectId: project1.id,
                    assigneeId: member.id,
                },
                {
                    title: 'Implement Authentication',
                    description: 'Set up JWT based authentication for the new web app.',
                    status: 'IN_PROGRESS',
                    projectId: project1.id,
                    assigneeId: admin.id,
                },
                {
                    title: 'Fix Navigation Bug',
                    description: 'The mobile menu does not close when clicking outside.',
                    status: 'TODO',
                    projectId: project1.id,
                    assigneeId: member.id,
                },
                {
                    title: 'App Store Submission',
                    description: 'Prepare screenshots and metadata for the App Store review.',
                    status: 'TODO',
                    projectId: project2.id,
                    assigneeId: member.id,
                },
                {
                    title: 'Push Notifications Integration',
                    description: 'Ensure Firebase push notifications are working on iOS.',
                    status: 'IN_PROGRESS',
                    projectId: project2.id,
                    assigneeId: admin.id,
                }
            ]
        });
        console.log('Database seeded successfully!');
        console.log('---');
        console.log('Admin Login: admin@taskmanager.com / password123');
        console.log('Member Login: member@taskmanager.com / password123');
    });
}
main().catch(console.error).then(() => prisma.$disconnect());
