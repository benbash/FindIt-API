const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');

const matchesKeyword = (keyword) => ({
  $or: [
    { title: { $regex: keyword, $options: 'i' } },
    { description: { $regex: keyword, $options: 'i' } },
    { category: { $regex: keyword, $options: 'i' } },
    { tags: { $in: [new RegExp(keyword, 'i')] } },
  ],
});

const buildFilter = ({ category, location, status, keyword, fromDate, toDate }, dateField) => {
  const filter = {};

  if (category) {
    filter.category = new RegExp(`^${category}$`, 'i');
  }

  if (location) {
    filter.$or = [
      { 'location.city': { $regex: location, $options: 'i' } },
      { 'location.state': { $regex: location, $options: 'i' } },
      { 'location.description': { $regex: location, $options: 'i' } },
      { 'location.landmark': { $regex: location, $options: 'i' } },
    ];
  }

  if (status) {
    filter.status = status;
  }

  if (keyword) {
    filter.$and = [...(filter.$and || []), matchesKeyword(keyword)];
  }

  if (fromDate || toDate) {
    filter[dateField] = {};

    if (fromDate) {
      filter[dateField].$gte = new Date(fromDate);
    }

    if (toDate) {
      filter[dateField].$lte = new Date(toDate);
    }
  }

  return filter;
};

exports.searchItems = async (req, res, next) => {
  try {
    const {
      category,
      location,
      status,
      keyword,
      fromDate,
      toDate,
      type = 'all',
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const results = [];

    if (type === 'all' || type === 'lost') {
      const lostItems = await LostItem.find(
        buildFilter({ category, location, status, keyword, fromDate, toDate }, 'dateLost')
      )
        .populate('reportedBy', 'name email phoneNumber role')
        .sort({ createdAt: -1 });

      lostItems.forEach((item) => {
        results.push({
          itemType: 'lost',
          ...item.toObject(),
        });
      });
    }

    if (type === 'all' || type === 'found') {
      const foundItems = await FoundItem.find(
        buildFilter({ category, location, status, keyword, fromDate, toDate }, 'dateFound')
      )
        .populate('reportedBy', 'name email phoneNumber role')
        .sort({ createdAt: -1 });

      foundItems.forEach((item) => {
        results.push({
          itemType: 'found',
          ...item.toObject(),
        });
      });
    }

    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const paginated = results.slice(skip, skip + limitNumber);

    return res.status(200).json({
      success: true,
      count: paginated.length,
      total: results.length,
      page: pageNumber,
      pages: Math.max(1, Math.ceil(results.length / limitNumber)),
      data: paginated,
    });
  } catch (error) {
    return next(error);
  }
};
