import Asset from "../models/assetModel.js";
import User from "../models/userModel.js";

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

export const updateAsset = async (req, res) => {
  try {
    const { name, description, image, status } = req.body;
    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      { name, description, image, status },
      { new: true }
    ).populate("currentHolder"); // Populate current holder to get the name

    res.json({
      message: "Asset updated successfully",
      assetId: asset._id,
      currentPrice: asset.lastTradingPrice,
      currentHolder: asset.currentHolder?.username || "N/A",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const publishAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      { status: "published" },
      { new: true }
    ).populate("currentHolder"); // Populate current holder to get the name

    res.json({
      message: "Asset published successfully",
      assetId: asset._id,
      currentPrice: asset.lastTradingPrice,
      currentHolder: asset.currentHolder?.username || "N/A",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAssetDetails = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate("creator")
      .populate("currentHolder");

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.json({
      assetId: asset._id,
      currentPrice: asset.lastTradingPrice,
      currentHolder: asset.currentHolder?.username || "N/A",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ creator: req.params.id }).populate(
      "currentHolder"
    ); // Populate current holder to get the name

    const response = assets.map((asset) => ({
      assetId: asset._id,
      currentPrice: asset.lastTradingPrice,
      currentHolder: asset.currentHolder?.username || "N/A",
    }));

    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
