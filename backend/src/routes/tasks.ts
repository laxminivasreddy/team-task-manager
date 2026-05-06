import { Router } from 'express';
import { prisma } from '../prisma';
import { authenticate, AuthRequest, requireAdmin } from '../middleware/auth';

const router = Router();

// Get all tasks (Admin sees all, Member sees assigned)
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const where = req.user!.role === 'ADMIN' ? {} : { assigneeId: req.user!.id };
    
    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a task (Admin only)
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { title, description, projectId, assigneeId, dueDate, status } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ error: 'Title and projectId are required' });
    }

    const task = await prisma.task.create({
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const taskId = req.params.id as string;
    const { title, description, assigneeId, dueDate, status } = req.body;

    const existingTask = await prisma.task.findUnique({ where: { id: taskId } });
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Members can only update status of their assigned tasks
    if (req.user!.role !== 'ADMIN') {
      if (existingTask.assigneeId !== req.user!.id) {
        return res.status(403).json({ error: 'Forbidden: Can only update your assigned tasks' });
      }
      
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { status }, // Only status can be updated by member
        include: {
          assignee: { select: { id: true, name: true } }
        }
      });
      return res.json(updatedTask);
    }

    // Admin can update everything
    const updatedTask = await prisma.task.update({
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    await prisma.task.delete({
      where: { id: req.params.id as string },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
