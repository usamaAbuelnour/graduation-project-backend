const { isValidObjectId } = require("mongoose");
const CustomError = require("../utils/CustomError.js");
const JobModel = require("../models/job.js");
const logger = require("../logs/logger.js");
const {
    createJobValidationSchema,
    updateJobValidationSchema,
} = require("../utils/jobValidation.js");

const getJobs = async (_, res) => {
    const jobs = await JobModel.find({});
    if (jobs.length) res.status(200).send(jobs);
    else {
        logger.info("There're no jobs yet!!");
        res.send("There're no jobs yet!!!!");
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
    });

    if (existingJob) return res.status(409).send("Job already exists ");

    const { id: userId } = req.user;
    const job = await JobModel.create({ userId, ...req.body });
    logger.info("job created");
    res.status(201).send(job);
};

const updateJob = async (req, res) => {
    try {
        await updateJobValidationSchema.validate(req.body, {
            stripUnknown: false,
        });
    } catch (error) {
        throw new CustomError(422, error.message);
    }

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
        logger.info("Job Updated");
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
    if (deletedJob) {
        res.send("Job deleted");
        logger.info("Job deleted");
    }
};

module.exports = {
    getJobs,
    setJob,
    updateJob,
    deleteJob,
};
