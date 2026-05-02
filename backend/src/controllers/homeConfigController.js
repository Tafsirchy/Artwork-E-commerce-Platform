const HomeConfig = require("../models/HomeConfig");
const Product = require("../models/Product"); // Ensure Product model is registered for population

// @desc    Get home config by section
// @route   GET /api/home-config/:section
// @access  Public
exports.getConfig = async (req, res) => {
  try {
    const config = await HomeConfig.findOne({ section: req.params.section }).populate("productIds");
    if (!config) return res.status(404).json({ message: "Config not found" });
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update home config
// @route   POST /api/home-config
// @access  Admin
exports.updateConfig = async (req, res) => {
  try {
    const { section, productIds } = req.body;
    let config = await HomeConfig.findOne({ section });

    if (config) {
      config.productIds = productIds;
      await config.save();
    } else {
      config = await HomeConfig.create({ section, productIds });
    }

    res.json(config);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
