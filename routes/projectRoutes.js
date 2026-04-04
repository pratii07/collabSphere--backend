const { Router } = require("express");
const { createProject, addMember, getUserProjects, editFile, removeFile, updateProject, addNote, deleteNote, getPublicProject } = require("../controllers/projectController");

const router = Router();

router.post("/createProject", createProject);
router.post("/addMember", addMember);
router.get("/my-projects/:userId", getUserProjects);
router.put("/edit-file", editFile);
router.delete("/remove-file", removeFile);
router.put("/update-project", updateProject);
router.post("/add-note", addNote);
router.delete("/delete-note", deleteNote);
router.get("/public/:publicId", getPublicProject);

module.exports = router;