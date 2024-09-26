const CustomError = require("../errors/CustomError");

const getPaginated = async (
    model,
    modelName,
    pageLimit,
    requestedPage,
    filterCriteria = {}
) => {
    const docsCount = await model.find(filterCriteria).countDocuments();

    if (!docsCount) throw new CustomError(200, `There're no ${modelName}s!!`);

    if (
        (requestedPage !== undefined && isNaN(requestedPage)) ||
        requestedPage === ""
    )
        throw new CustomError(400, "page number must be a number!!!");

    const currentPage = Number(requestedPage) || 1;
    const limit = pageLimit;
    const skip = (currentPage - 1) * limit;

    const pagesCount = Math.ceil(docsCount / limit);
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

    const docs = await model
        .find(filterCriteria)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    return { docs, docsCount, pagesCount, currentPage };
};

module.exports = getPaginated;
