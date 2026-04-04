const { Router } = require("express");
const { explainNote, improveNote, askAI } = require("../controllers/aiController");

const router = Router();

router.post("/explain-note", explainNote);
router.post("/improve-note", improveNote);
router.post("/ask", askAI);

module.exports = router;
