const FoundItem = require('../models/FoundItem');
const Claim = require('../models/Claim');
const AppError = require('../utils/appError');

exports.createFoundItem = async (req, res, next) => {
  try {
    const foundItem = await FoundItem.create({
      ...req.body,
      reportedBy: req.user._id,
    });

    const populatedItem = await FoundItem.findById(foundItem._id).populate(
      'reportedBy',
      'name email phoneNumber role'
    );

    return res.status(201).json({
      success: true,
      message: 'Found item reported successfully',
      data: populatedItem,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getFoundItems = async (req, res, next) => {
  try {
    const { category, city, state, status, reportedBy, keyword } = req.query;
    const filter = {};

    if (category) {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (city) {
      filter['location.city'] = new RegExp(`^${city}$`, 'i');
    }

    if (state) {
      filter['location.state'] = new RegExp(`^${state}$`, 'i');
    }

    if (status) {
      filter.status = status;
    }

    if (reportedBy === 'me' && req.user) {
      filter.reportedBy = req.user._id;
    }

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword, 'i')] } },
      ];
    }

    const items = await FoundItem.find(filter)
      .populate('reportedBy', 'name email phoneNumber role')
      .populate('matchedLostItem', 'title category status')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateFoundItem = async (req, res, next) => {
  try {
    const item = await FoundItem.findById(req.params.id);

    if (!item) {
      return next(new AppError('Found item not found', 404));
    }

    if (item.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this found item', 403));
    }

    Object.keys(req.body).forEach((key) => {
      item[key] = req.body[key];
    });

    await item.save();

    const populatedItem = await FoundItem.findById(item._id)
      .populate('reportedBy', 'name email phoneNumber role')
      .populate('matchedLostItem', 'title category status');

    return res.status(200).json({
      success: true,
      message: 'Found item updated successfully',
      data: populatedItem,
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteFoundItem = async (req, res, next) => {
  try {
    const item = await FoundItem.findById(req.params.id);

    if (!item) {
      return next(new AppError('Found item not found', 404));
    }

    if (item.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this found item', 403));
    }

    const activeClaimsCount = await Claim.countDocuments({
      foundItem: item._id,
      status: { $in: ['pending', 'approved'] },
    });

    if (activeClaimsCount > 0) {
      return next(
        new AppError(
          'Cannot delete this found item because it has pending or approved claims',
          409
        )
      );
    }

    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Found item deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};
