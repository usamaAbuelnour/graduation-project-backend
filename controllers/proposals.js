const { isValidObjectId } = require("mongoose");
const CustomError = require("../errors/CustomError");
const JobModel = require("../models/job");
const ProposalModel = require("../models/proposal");
const getPaginated = require("../utils/getPaginated");
const proposalValidationSchema = require("../validation/proposalValidation");
const ClientModel = require("../models/client");
const UserModel = require("../models/user");

const getProposals = async (req, res) => {
    const { id: userId } = req.user;

    const { page: requestedPage } = req.query;

    const { docs, docsCount, pagesCount, currentPage } = await getPaginated(
        ProposalModel,
        "proposal",
        10,
        requestedPage,
        { userId }
    );

    const populatedDocs = await ProposalModel.populate(docs, [
        {
            path: "jobId",
            select: "-_id -__v -proposals",
            populate: {
                path: "userId",
                select: "firstName lastName email",
            },
        },
    ]);

    if (docs.length)
        res.send({
            proposal: populatedDocs,
            proposalsCount: docsCount,
            pagesCount,
            currentPage,
        });
    else {
        res.send("There're no proposals!!");
    }
};

const setProposal = async (req, res) => {
    try {
        await proposalValidationSchema.validate(req.body, {
            stripUnknown: false,
        });
    } catch (error) {
        throw new CustomError(422, error.message);
    }

    const { id: userId } = req.user;
    const { jobId } = req.body;

    const existingProposal = await ProposalModel.findOne({
        userId,
        jobId,
    });

    if (existingProposal)
        return res.status(409).send("You've applied to this job before!!");

    const proposal = await ProposalModel.create({ userId, ...req.body });

    const jobToUpdate = await JobModel.findById(jobId);
    jobToUpdate.set({ proposals: [...jobToUpdate.proposals, proposal._id] });
    await jobToUpdate.save();

    res.status(201).send(proposal);
};

const acceptOrRejectProposal = async (req, res) => {
    const { id: proposalId } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(proposalId))
        throw new CustomError(422, "Invalid proposal id!!");

    if (!["accepted", "rejected"].includes(status))
        throw new CustomError(
            422,
            "Stauts value should be either accepted or rejected!!"
        );

    const existingProposal = await ProposalModel.findById(proposalId);

    if (!existingProposal) throw new CustomError(404, "No such proposal found");

    if (existingProposal.status !== "pending")
        throw new CustomError(409, "This proposal is no longer pending!!");

    existingProposal.set({ status });
    await existingProposal.save();

    const { id: userId } = req.user;
    const { jobId } = existingProposal;
    const job = await JobModel.findById(jobId);

    if (status === "accepted") {
        job.set({ acceptedProposal: existingProposal._id });
        const { proposals } = job;
        proposals.forEach(async (proposal) => {
            await ProposalModel.findOneAndUpdate(
                { _id: proposal, status: "pending" },
                { status: "rejected" }
            );
        });
        await job.save();

        const existingUser = await UserModel.findOne({
            _id: userId,
            clientId: { $exists: true },
        });

        if (!existingUser.clientId) {
            const newClient = await ClientModel.create({
                userId,
                jobsCount: 1,
            });

            existingUser.set({ clientId: newClient._id });
            await existingUser.save();
        } else {
            const existingClient = await ClientModel.findOne({ userId });
            existingClient.set({ jobsCount: existingClient.jobsCount + 1 });
            await existingClient.save();
        }
    }
    res.send(await job.populate("acceptedProposal"));
};

module.exports = { getProposals, setProposal, acceptOrRejectProposal };
