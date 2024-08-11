import Asset from "../models/assetModel.js";
import User from "../models/userModel.js";
import Request from "../models/requestModel.js";

// Create a request to buy an asset
export const requestToBuy = async (req, res) => {
  try {
    const { proposedPrice } = req.body;
    const asset = await Asset.findById(req.params.id).populate("currentHolder");

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // Prevent the current holder from requesting to buy their own asset
    if (
      asset.currentHolder &&
      asset.currentHolder._id?.toString() === req.user.id
    ) {
      return res
        .status(400)
        .json({ message: "You cannot propose to buy your own asset." });
    }

    const request = new Request({
      assetId: asset._id,
      proposedPrice,
      buyer: req.user.id,
      status: "pending",
    });

    await request.save();
    res.json({
      message: "Purchase request sent",
      currentHolder: asset.currentHolder?.username,
      currentPrice: asset.lastTradingPrice,
      requestId: request._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Negotiate the price of an asset
export const negotiateRequest = async (req, res) => {
  try {
    const { newProposedPrice } = req.body;
    const request = await Request.findById(req.params.id).populate("assetId");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const asset = request.assetId;

    // Prevent accepting a request that has already been accepted
    if (request.status !== "pending") {
      return res.status(400).json({
        message:
          "This negotiation is closed, please create a new purchase request.",
      });
    }

    // Save the new negotiation as a separate request in the database
    const newRequest = new Request({
      assetId: asset._id,
      proposedPrice: newProposedPrice,
      buyer: req.user.id,
      status: "pending",
    });

    await newRequest.save();
    console.log(newRequest);

    res.json({
      message: "Negotiation updated",
      currentHolder: asset.currentHolder,
      currentPrice: asset.lastTradingPrice,
      newRequestId: newRequest._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Accept a purchase request by the current holder
export const acceptRequestByHolder = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("assetId")
      .populate("buyer");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const asset = request.assetId;

    // Prevent accepting a request that has already been accepted
    if (request.status !== "pending") {
      return res.status(400).json({
        message:
          "This negotiation is closed, please create a new purchase request.",
      });
    }

    // Prevent the current holder from accepting a request from themselves
    if (asset.currentHolder?.toString() === request.buyer._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot accept your own request." });
    }

    // Assign the asset to the buyer who made the latest request
    asset.currentHolder = request.buyer._id;
    asset.lastTradingPrice = request.proposedPrice;
    asset.numberOfTransfers += 1;

    await asset.save();

    // Mark all other requests for this asset as "closed"
    await Request.updateMany(
      { assetId: asset._id, status: "pending" },
      { status: "closed" }
    );

    request.status = "accepted";
    await request.save();

    res.json({
      message: "Request accepted, holder updated",
      currentHolder: asset.currentHolder.username,
      currentPrice: asset.lastTradingPrice,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Accept a purchase request by the buyer
export const acceptRequestByBuyer = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("assetId")
      .populate("buyer");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (req.user._id.toString() === request.buyer._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot accept your own request." });
    }

    // Prevent accepting a request that has already been accepted
    if (request.status !== "pending") {
      return res.status(400).json({
        message:
          "This negotiation is closed, please create a new purchase request.",
      });
    }

    const asset = request.assetId;

    // The buyer becomes the new holder of the asset
    asset.currentHolder = req.user.id;
    asset.lastTradingPrice = request.proposedPrice;
    asset.numberOfTransfers += 1;

    await asset.save();

    // Mark all other requests for this asset as "closed"
    await Request.updateMany(
      { assetId: asset._id, status: "pending" },
      { status: "closed" }
    );

    request.status = "accepted";
    await request.save();

    res.json({
      message: "Request accepted, holder updated",
      currentHolder: asset.currentHolder.username,
      currentPrice: asset.lastTradingPrice,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Deny a purchase request
export const denyRequest = async (req, res) => {
  try {
    await Request.findByIdAndUpdate(req.params.id, { status: "denied" });
    res.json({ message: "Request denied" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all requests made by the user
export const getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ buyer: req.params.id });
    res.json(requests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
