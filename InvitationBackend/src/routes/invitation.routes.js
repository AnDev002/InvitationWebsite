const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitation.controller');
const { protect } = require('../middleware/auth.middleware'); // Middleware xác thực người dùng
const { upload } = require('../middleware/upload.middleware');

// === Route công khai ===
// Lấy thiệp mời công khai bằng slug, không cần đăng nhập
router.get('/slug/:slug', invitationController.getPublicInvitationBySlug);
router.get('/public/:id', invitationController.getPublicInvitationById);
router.put('/:invitationId/guests/:guestId/rsvp', invitationController.submitRsvp);

// Gửi lời chúc cho một thiệp mời, không cần đăng nhập
router.post('/:id/wishes', invitationController.addWish);


// === Các Route cần xác thực (bảo vệ) ===
// Áp dụng middleware 'protect' cho tất cả các route bên dưới
router.use(protect);

// CRUD cho thiệp mời của người dùng
router.route('/')
    .post(invitationController.createInvitation) // Tạo thiệp mới từ template
    .get(invitationController.getMyInvitations); // Lấy tất cả thiệp của người dùng

router.route('/:id')
    .get(invitationController.getInvitation) // Lấy chi tiết 1 thiệp (chủ sở hữu)
    .put(invitationController.updateInvitation) // Cập nhật thiệp
    .delete(invitationController.deleteInvitation); // Xóa thiệp

// MỚI: Route để cập nhật cài đặt thiệp
router.put(
    '/:id/settings',
    upload.any(), // Sử dụng upload.any()
    invitationController.updateInvitationSettings
);

// CRUD cho khách mời trong một thiệp (chỉ chủ sở hữu mới có quyền)
router.route('/:id/guests')
    .post(invitationController.addGuest); // Thêm khách mời

router.route('/:id/guests/:guestId')
    .put(invitationController.updateGuest) // Cập nhật khách mời
    .delete(invitationController.removeGuest); // Xóa khách mời

router.put('/:id/guests/:guestId/send-email', invitationController.sendInvitationEmailToGuest);

// MỚI: Routes để quản lý nhóm khách mời
router.route('/:id/guest-groups') // Endpoint mới cho quản lý nhóm
    .get(invitationController.getGuestGroups) // Lấy tất cả nhóm cho một thiệp
    .post(invitationController.addGuestGroup); // Thêm một nhóm mới

router.route('/:id/guest-groups/:groupId')
    .put(invitationController.updateGuestGroup) // Cập nhật một nhóm cụ thể
    .delete(invitationController.removeGuestGroup); // Xóa một nhóm cụ thể


module.exports = router;
