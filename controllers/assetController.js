import Asset from "../models/assetModel.js";
import User from "../models/userModel.js";

// Create a new asset
export const createAsset = async (req, res) => {
  try {
    const { name, description, image, status } = req.body;
    const asset = new Asset({
      name,
      description,
      image,
      status,
      creator: req.user.id,
      currentHolder: req.user.id, // Set the current holder as the creator
      lastTradingPrice: 0, // Default initial price
    });
    await asset.save();

    // Fetch the current holder's name
    const currentHolder = await User.findById(req.user.id).select("username");

    res.json({
      message: "Asset created successfully",
      assetId: asset._id,
      currentPrice: asset.lastTradingPrice,
      currentHolder: currentHolder.username,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an existing asset (only by the current holder)
export const updateAsset = async (req, res) => {
  try {
    const { name, description, image, status } = req.body;
    const asset = await Asset.findById(req.params.id);

    // Ensure the current user is the current holder
    if (asset.currentHolder.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this asset." });
    }

    // Update asset details
    asset.name = name;
    asset.description = description;
    asset.image = image;
    asset.status = status;

    await asset.save();

    res.json({
      message: "Asset updated successfully",
      assetId: asset._id,
      currentPrice: asset.lastTradingPrice,
      currentHolder: req.user.username,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Publish an asset (only by the current holder)
export const publishAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    // Ensure the current user is the current holder
    if (asset.currentHolder.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to publish this asset." });
    }

    asset.status = "published";
    await asset.save();

    res.json({
      message: "Asset published successfully",
      assetId: asset._id,
      currentPrice: asset.lastTradingPrice,
      currentHolder: req.user.username,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get details of a specific asset
export const getAssetDetails = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate("creator")
      .populate("currentHolder");

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.json(asset);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all assets created by a specific user
export const getUserAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ currentHolder: req.params.id }).populate(
      "creator"
    );

    const response = assets.map((asset) => ({
      assetId: asset._id,
      currentPrice: asset.lastTradingPrice,
      creator: asset.creator.username,
    }));

    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
