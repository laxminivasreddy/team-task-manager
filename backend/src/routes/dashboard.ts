import { Router } from 'express';
import { prisma } from '../prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;

    const where = role === 'ADMIN' ? {} : { assigneeId: userId };

    const tasks = await prisma.task.findMany({ where });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'DONE').length;
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const todoTasks = tasks.filter(t => t.status === 'TODO').length;
    
    const now = new Date();
    const overdueTasks = tasks.filter(t => 
      t.status !== 'DONE' && t.dueDate && new Date(t.dueDate) < now
    ).length;

    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router;
