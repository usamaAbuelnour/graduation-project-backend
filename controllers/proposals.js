const CustomError = require("../errors/CustomError");
const JobModel = require("../models/job");
const ProposalModel = require("../models/proposal");
const getPaginated = require("../utils/getPaginated");
const proposalValidationSchema = require("../validation/proposalValidation");

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

    const populatedDocs = await ProposalModel.populate(docs, {
        path: "userId",
        select: "_id firstName lastName email",
    });

    if (docs.length)
        res.send({
            proposal: populatedDocs,
            proposalCount: docsCount,
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

    console.log(jobToUpdate);
    res.status(201).send(proposal);
};

module.exports = { getProposals, setProposal };
