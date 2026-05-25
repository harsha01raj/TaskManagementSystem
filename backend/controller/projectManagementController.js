const prisma = require("../src/config/prisma.js");

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }
    const project = await prisma.project.create({
      data: {
        title,
        description,
        userId: req.userId,
      },
    });
    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.body;

    const filters = [];

    if (status) filters.push({ status });
    if (priority) filters.push({ priority });
    if (assignedTo) filters.push({ assignedTo: Number(assignedTo) });

    let whereCondition = {
      isDeleted: false,
    };

    if (filters.length > 0) {
      whereCondition = {
        tasks: {
          some: {
            AND: filters,
          },
        },
      };
    }

    const projects = await prisma.project.findMany({
      where: whereCondition,
      include: {
        tasks: true,
      },
    });

    return res.status(200).json({ projects });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        tasks: true,
      },
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    return res.status(200).json({ project });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }
    const project = await prisma.project.update({
      where: { id: parseInt(id), isDeleted: false },
      data: { title, description },
    });
    return res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id), isDeleted: false },
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    await prisma.project.update({
      where: { id: parseInt(id), isDeleted: false },
      data: { isDeleted: true },
    });
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
