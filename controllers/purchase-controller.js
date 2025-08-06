const { ResponseHandler, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const { purchaseRepository } = require("../repositories");

const purchasesFind = async (req, res) => {
  try {
    Logger.info(Constants.FETCHING_DATA);

    const purchases = await purchaseRepository.findPurchasesAll(req.query);
    return ResponseHandler.sendOkResponse(purchases, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.purchaseControllers = {
  purchasesFind,
};
