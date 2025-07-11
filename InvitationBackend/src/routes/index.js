const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const invitationRoutes = require('./invitation.routes');
const invitationTemplateRoutes = require('./invitationTemplate.routes');
const designAssetRoutes = require('./designAsset.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/invitations', invitationRoutes);
router.use('/invitation-templates', invitationTemplateRoutes);
router.use('/design-assets', designAssetRoutes);

module.exports = router;