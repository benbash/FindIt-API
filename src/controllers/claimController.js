const Claim = require('../models/Claim');
const FoundItem = require('../models/FoundItem');
const AppError = require('../utils/appError');

exports.createClaim = async (req, res, next) => {
  try {
    const foundItem = await FoundItem.findById(req.body.foundItem);

    if (!foundItem) {
      return next(new AppError('Found item not found', 404));
    }

    if (foundItem.reportedBy.toString() === req.user.id) {
      return next(new AppError('You cannot claim an item you reported', 400));
    }

    if (foundItem.status !== 'open') {
      return next(new AppError('This found item is not open for claims', 400));
    }

    const claim = await Claim.create({
      ...req.body,
      claimant: req.user._id,
    });

    const populatedClaim = await Claim.findById(claim._id)
      .populate('claimant', 'name email phoneNumber role')
      .populate('foundItem');

    return res.status(201).json({
      success: true,
      message: 'Claim submitted successfully',
      data: populatedClaim,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getClaims = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user.role !== 'admin') {
      const reportedItems = await FoundItem.find({ reportedBy: req.user._id }).select('_id');
      const foundItemIds = reportedItems.map((item) => item._id);

      filter = {
        $or: [{ claimant: req.user._id }, { foundItem: { $in: foundItemIds } }],
      };
    }

    const claims = await Claim.find(filter)
      .populate('claimant', 'name email phoneNumber role')
      .populate({
        path: 'foundItem',
        populate: {
          path: 'reportedBy',
          select: 'name email phoneNumber role',
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateClaim = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('foundItem');

    if (!claim) {
      return next(new AppError('Claim not found', 404));
    }

    const isAdmin = req.user.role === 'admin';
    const isFoundItemOwner =
      claim.foundItem && claim.foundItem.reportedBy.toString() === req.user.id;
    const isClaimant = claim.claimant.toString() === req.user.id;

    if (!isAdmin && !isFoundItemOwner && !isClaimant) {
      return next(new AppError('Not authorized to update this claim', 403));
    }

    if (req.body.status !== undefined) {
      const claimantCancellingOwnClaim = isClaimant && req.body.status === 'cancelled';

      if (!isAdmin && !isFoundItemOwner && !claimantCancellingOwnClaim) {
        return next(new AppError('Only the item owner or admin can change claim status', 403));
      }

      claim.status = req.body.status;
      if (req.body.resolutionNote !== undefined) {
        claim.resolutionNote = req.body.resolutionNote;
      }

      if (['approved', 'rejected', 'cancelled'].includes(req.body.status)) {
        claim.resolvedAt = new Date();
      }

      if (req.body.status === 'approved') {
        claim.foundItem.status = 'claimed';
        await claim.foundItem.save();
      }
    } else if (req.body.resolutionNote !== undefined) {
      if (!isAdmin && !isFoundItemOwner) {
        return next(new AppError('Only the item owner or admin can add resolution notes', 403));
      }
      claim.resolutionNote = req.body.resolutionNote;
    }

    await claim.save();

    const populatedClaim = await Claim.findById(claim._id)
      .populate('claimant', 'name email phoneNumber role')
      .populate({
        path: 'foundItem',
        populate: {
          path: 'reportedBy',
          select: 'name email phoneNumber role',
        },
      });

    return res.status(200).json({
      success: true,
      message: 'Claim updated successfully',
      data: populatedClaim,
    });
  } catch (error) {
    return next(error);
  }
};
