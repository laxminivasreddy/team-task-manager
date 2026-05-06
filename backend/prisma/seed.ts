import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create users
  const adminPassword = await bcrypt.hash('password123', 10);
  const memberPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskmanager.com' },
    update: {},
    create: {
      email: 'admin@taskmanager.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const member = await prisma.user.upsert({
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
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Overhauling the company corporate website with a modern design.',
      ownerId: admin.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Launch',
      description: 'Final testing and deployment for the new iOS and Android application.',
      ownerId: admin.id,
    },
  });

  // Create Tasks
  await prisma.task.createMany({
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
}

main().catch(console.error).then(() => prisma.$disconnect());
