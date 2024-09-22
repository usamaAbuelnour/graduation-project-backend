const { isValidObjectId } = require("mongoose");
const CustomError = require("../errors/CustomError.js");
const JobModel = require("../models/job.js");
const { createJobValidationSchema } = require("../validation/jobValidation.js");

const getJobs = async (req, res) => {
    console.log(req.query);
    const jobs = await JobModel.find(req.query)
        .sort({ createdAt: -1 })
        .populate({
            path: "userId",
            select: "_id firstName lastName email",
        });
    if (jobs.length) res.status(200).send(jobs);
    else {
        res.send("There're no jobs!!");
    }
};

const getPaginatedJobs = async (req, res) => {
    
    const { page: requestedPage, ...filterCriteria } = req.query;
    
    const jobsCount = await JobModel.find(filterCriteria).countDocuments();
  
    if (!jobsCount) return res.send("There're no jobs!!");
    
    if (
        (requestedPage !== undefined && isNaN(requestedPage)) ||
        requestedPage === ""
    )
        throw new CustomError(400, "page number must be a number!!!");

    const page = Number(requestedPage) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const pagesCount = Math.ceil(jobsCount / limit);
    if (requestedPage > pagesCount)
        throw new CustomError(
            400,
            "The provided page number exceeds the total page count!!"
        );

    if (requestedPage <= 0)
        throw new CustomError(
            400,
            "The provided page number can't be negative or equal zero!!"
        );

    const jobs = await JobModel.find(filterCriteria)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate({
            path: "userId",
            select: "_id firstName lastName email",
        });
    if (jobs.length)
        res.send({
            jobs,
            pagesCount,
            currentPage: page,
            prev: page > 1,
            next: page < pagesCount,
        });
    else {
        res.send("There're no jobs!!");
    }
};

const setJob = async (req, res) => {
    try {
        await createJobValidationSchema.validate(req.body, {
            stripUnknown: false,
        });
    } catch (error) {
        throw new CustomError(422, error.message);
    }

    const existingJob = await JobModel.findOne({
        title: req.body.title,
        location: req.body.location,
        category: req.body.category,
    });

    if (existingJob) return res.status(409).send("Job already exists ");

    const { id: userId } = req.user;
    const job = await JobModel.create({ userId, ...req.body });
    res.status(201).send(job);
};

const updateJob = async (req, res) => {
    // try {
    //     await updateJobValidationSchema.validate(req.body, {
    //         stripUnknown: false,
    //     });
    // } catch (error) {
    //     throw new CustomError(422, error.message);
    // }

    const { id: jobId } = req.params;
    const { id: userId } = req.user;
    if (!isValidObjectId(jobId)) throw new CustomError(400, "Invalid job id");

    if (!Object.keys(req.body).length)
        throw new CustomError(422, "there's no data sent!!");

    if (!(await JobModel.findById(jobId)))
        return res.status(200).send("No such job exists");

    if (!(await JobModel.findOne({ _id: jobId, userId })))
        throw new CustomError(
            403,
            "You do not have right to modify this job!!!"
        );

    const updatedJob = await JobModel.findByIdAndUpdate(jobId, req.body, {
        new: true,
    });
    if (updatedJob) {
        res.send("Job updated");
    }
};

const deleteJob = async (req, res) => {
    const { id: jobId } = req.params;
    const { id: userId } = req.user;

    if (!isValidObjectId(jobId)) throw new CustomError(400, "Invalid job id");

    if (!(await JobModel.findById(jobId)))
        return res.status(200).send("No such job exists");

    if (!(await JobModel.findOne({ _id: jobId, userId })))
        throw new CustomError(
            403,
            "You do not have right to remove this job!!!"
        );
    const deletedJob = await JobModel.findByIdAndDelete(jobId);
    if (deletedJob) res.send("Job deleted");
};

module.exports = {
    getJobs,
    getPaginatedJobs,
    setJob,
    updateJob,
    deleteJob,
};
