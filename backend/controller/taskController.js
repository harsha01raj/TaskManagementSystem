const prisma = require("../src/config/prisma.js");

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      projectId,
      priority,
      assignedTo,
      dueDate,
    } = req.body;
    console.log(req.body);
    if (
      !title ||
      !description ||
      !status ||
      !projectId ||
      !priority ||
      !assignedTo ||
      !dueDate
    ) {
      return res.status(400).json({
        error:
          "Title, description, status, projectId, priority, assignedTo and dueDate are required",
      });
    }
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        dueDate: new Date(dueDate),
        project: {
          connect: {
            id: parseInt(projectId),
          },
        },
        user: {
          connect: {
            id: parseInt(assignedTo),
          },
        },
      },
    });
    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.query;
    const filters = [];
    if (status) filters.push({ status });
    if (priority) filters.push({ priority });
    if (assignedTo) {
      filters.push({
        assignedTo: Number(assignedTo),
      });
    }
    let whereCondition = {
      isDeleted: false,
    };
    if (filters.length > 0) {
      whereCondition = {
        isDeleted: false,
        AND: filters,
      };
    }
    const tasks = await prisma.task.findMany({
      where: whereCondition,
      include: {
        user: true,
        project: true,
      },
    });
    return res.status(200).json({ tasks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;
    if (!title || !description || !status || !priority) {
      return res.status(400).json({
        error: "Title, description, status and priority are required",
      });
    }
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { title, description, status, priority: priority },
    });
    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true },
    });
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
};
