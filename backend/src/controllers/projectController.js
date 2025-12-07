const Project = require("../models/Project");

// ✅ CREATE PROJECT
exports.createProject = async (req, res) => {
  try {
    const { name, description, cloudProvider } = req.body;

    const project = new Project({
      name,
      description,
      cloudProvider,
      owner: req.user.id
    });

    await project.save();

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET USER PROJECTS
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
