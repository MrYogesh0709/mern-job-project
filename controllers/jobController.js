import { BadRequestError, NotFoundError } from "../errors/index.js";
import Job from "../model/Job.js";
import { StatusCodes } from "http-status-codes";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";
import moment from "moment";

const createJob = async (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError("Please provide company and position");
  }
  req.body.createdBy = req.user.userId;
  const job = await Job.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ job });
};

const getAllJob = async (req, res) => {
  const { search, status, jobType, sort } = req.query;

  const queryObject = { createdBy: req.user.userId };
  //ADD STUFF BASED ON CONDITION
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  if (search) {
    // queryObject.position = search;
    queryObject.position = { $regex: search, $options: "i" };
  }

  // console.log(queryObject);
  //NO AWAIT
  let result = Job.find(queryObject);

  //CHIAN SORT CONDITION
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }

  //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);
  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });
  checkPermissions(req.user, job.createdBy);
  await job.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! Job removed..." });
};

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;

  if (!position || !company) {
    throw new BadRequestError("Please provide all values");
  }
  const job = await Job.findOne({ _id: jobId });
  //here we can go for _id ,createdBy for same user update not other but for that admin can't do that so checkPermissions
  if (!job) {
    throw new NotFoundError(`No job with id :${jobId}`);
  }
  //if you go for find then job[0] with findOne job.createBy
  checkPermissions(req.user, job.createdBy);
  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ updatedJob });
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  //converted in to object nothing else
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});
  //for new users
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        //moment count 0 to 12 while mongo count 1 to 12;
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, updateJob, deleteJob, showStats, getAllJob };
