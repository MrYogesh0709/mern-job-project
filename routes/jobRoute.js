import express from "express";
import {
  createJob,
  deleteJob,
  getAllJob,
  showStats,
  updateJob,
} from "../controllers/jobController.js";
const router = express.Router();
import testUser from "../middleware/testUser.js";

router.route("/").post(testUser, createJob).get(getAllJob);
//remember why showStats is upper that id:;
router.route("/stats").get(showStats);
router.route("/:id").delete(testUser, deleteJob).patch(testUser, updateJob);

export default router;
