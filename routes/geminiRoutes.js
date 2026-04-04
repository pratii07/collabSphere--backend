const { Router } = require("express");
const { explainText, generateDocs, generateReadme } = require("../controllers/geminiController");

const router = Router();

router.post("/explain", explainText);
router.post("/docs", generateDocs);
router.post("/readme", generateReadme);

module.exports = router;
