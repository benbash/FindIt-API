import LostItem from '../models/LostItem.js';
import AppError from '../utils/appError.js';

export const createLostItem = async (req, res, next) => {
  try {
    const lostItem = await LostItem.create({
      ...req.body,
      reportedBy: req.user._id,
    });

    const populatedItem = await LostItem.findById(lostItem._id).populate(
      'reportedBy',
      'name email phoneNumber role'
    );

    return res.status(201).json({
      success: true,
      message: 'Lost item reported successfully',
      data: populatedItem,
    });
  } catch (error) {
    return next(error);
  }
};

export const getLostItems = async (req, res, next) => {
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

    const items = await LostItem.find(filter)
      .populate('reportedBy', 'name email phoneNumber role')
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

export const getLostItemById = async (req, res, next) => {
  try {
    const item = await LostItem.findById(req.params.id).populate(
      'reportedBy',
      'name email phoneNumber role'
    );

    if (!item) {
      return next(new AppError('Lost item not found', 404));
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateLostItem = async (req, res, next) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return next(new AppError('Lost item not found', 404));
    }

    if (item.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this lost item', 403));
    }

    Object.keys(req.body).forEach((key) => {
      item[key] = req.body[key];
    });

    await item.save();

    const populatedItem = await LostItem.findById(item._id).populate(
      'reportedBy',
      'name email phoneNumber role'
    );

    return res.status(200).json({
      success: true,
      message: 'Lost item updated successfully',
      data: populatedItem,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteLostItem = async (req, res, next) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return next(new AppError('Lost item not found', 404));
    }

    if (item.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this lost item', 403));
    }

    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Lost item deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};
