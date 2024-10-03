const { isValidObjectId } = require("mongoose");
const CustomError = require("../errors/CustomError.js");
const JobModel = require("../models/job.js");
const { createJobValidationSchema } = require("../validation/jobValidation.js");
const getPaginated = require("../utils/getPaginated.js");

const getMyJobs = async (req, res) => {
    const { id: userId } = req.user;

    const { page: requestedPage } = req.query;

    const { docs, docsCount, pagesCount, currentPage } = await getPaginated(
        JobModel,
        "job",
        10,
        requestedPage,
        { userId, acceptedProposal: null }
    );

    const populatedDocs = await JobModel.populate(docs, [
        {
            path: "userId",
            select: "_id firstName lastName email",
        },
        {
            path: "proposals",
            select: "-__v -jobId",
            populate: {
                path: "userId",
                select: "-_id firstName lastName email",
            },
        },
    ]);
    if (docs.length)
        res.send({
            jobs: populatedDocs,
            jobsCount: docsCount,
            pagesCount,
            currentPage,
        });
    else {
        res.send("There're no jobs!!");
    }
};

const getAllJobs = async (req, res) => {
    const { page: requestedPage, ...filterCriteria } = req.query;

    const { docs, docsCount, pagesCount, currentPage } = await getPaginated(
        JobModel,
        "job",
        10,
        requestedPage,
        { ...filterCriteria, acceptedProposal: null }
    );

    const populatedDocs = await JobModel.populate(docs, {
        path: "userId",
        select: "_id firstName lastName email createdAt clientId",
        populate: {
            path: "clientId",
            select: "jobsCount -_id",
        },
    });

    if (docs.length)
        res.send({
            jobs: populatedDocs,
            jobsCount: docsCount,
            pagesCount,
            currentPage,
            locations: [
                "portfouad",
                "portsaid",
                "suez",
                "10th of ramadan",
                "el shrok",
                "el obour",
                "new capital",
                "badr",
                "5th settlement",
                "nasr city",
            ],
            categories: [
                "Concrete Construction",
                "Consultation",
                "Finishing Works",
            ],
            services: [
                "Reinforced Concrete Pouring",
                "Concrete Leveling",
                "Concrete Structure Repairs",

                "Concrete Structure Design",
                "Infrastructure Consultation",
                "Construction Project Management",

                "Interior and Exterior Finishing Services",
                "Plumbing Services",
                "Masonry Services",
            ],
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
    getMyJobs,
    getAllJobs,
    setJob,
    updateJob,
    deleteJob,
};
