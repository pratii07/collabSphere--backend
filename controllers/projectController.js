const Project = require("../models/projectSchema");
const User = require("../models/userSchema");


exports.createProject = async (req, res) => {
  const { projectName, ownerId, description, codeFiles } = req.body;
  try {
    const project = new Project({
      projectName,
      owner: ownerId,
      members: [ownerId],
      description,
      notes: req.body.notes ? [{ title: "Initial Note", content: req.body.notes, addedBy: ownerId }] : [],
      codeFiles: (codeFiles || []).map(file => ({ ...file, addedBy: ownerId }))
    });

    const saved = await project.save();
    
    // Populate before returning
    const populated = await Project.findById(saved._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.addMember = async (req, res) => {
  const { projectId, identifier } = req.body; // identifier can be email or name
  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { name: identifier }]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    project.members.push(user._id);
    await project.save();

    res.json({ message: "Member added successfully", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserProjects = async (req, res) => {
  const { userId } = req.params;
  try {
    const projects = await Project.find({
      members: userId
    })
      .populate("owner", "name email")
      .populate("members", "name email")
      .populate("notes.addedBy", "name email")
      .populate("codeFiles.addedBy", "name email");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.editFile = async (req, res) => {
  const { projectId, fileId, fileName, content } = req.body;
  try {
    const project = await Project.findOneAndUpdate(
      { _id: projectId, "codeFiles._id": fileId },
      { 
        $set: { 
          "codeFiles.$.fileName": fileName,
          "codeFiles.$.content": content 
        } 
      },
      { returnDocument: "after" }
    );
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFile = async (req, res) => {
  const { projectId, fileId } = req.body;
  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { codeFiles: { _id: fileId } } },
      { returnDocument: "after" }
    );
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  const { projectId, projectName, description, codeFiles, isPublic } = req.body;
  try {
    const projectToUpdate = await Project.findById(projectId);
    if (!projectToUpdate) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Generate publicId if making public for the first time
    let publicId = projectToUpdate.publicId;
    if (isPublic && !publicId) {
      const crypto = require("crypto");
      publicId = crypto.randomBytes(6).toString("hex"); // 12 character random string
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      { $set: { projectName, description, codeFiles, isPublic, publicId } },
      { new: true }
    ).populate("owner", "name email")
     .populate("members", "name email")
     .populate("notes.addedBy", "name email")
     .populate("codeFiles.addedBy", "name email");

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addNote = async (req, res) => {
  const { projectId, title, content, userId } = req.body;
  console.log("addNote called with:", { projectId, title, content, userId });
  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $push: { notes: { title, content, addedBy: userId } } },
      { new: true }
    ).populate("owner", "name email")
     .populate("members", "name email")
     .populate("notes.addedBy", "name email")
     .populate("codeFiles.addedBy", "name email");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    console.error("addNote error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  const { projectId, noteId } = req.body;
  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { notes: { _id: noteId } } },
      { new: true }
    ).populate("owner", "name email").populate("members", "name email");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getPublicProject = async (req, res) => {
  const { publicId } = req.params;
  try {
    // Only fetch non-sensitive data
    const project = await Project.findOne({ publicId, isPublic: true })
      .select("projectName description notes createdAt")
      .populate("notes.addedBy", "name")
      .populate("owner", "name");

    if (!project) {
      return res.status(404).json({ error: "Public project not found or is no longer public." });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
