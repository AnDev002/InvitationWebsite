const invitationService = require('../services/invitation.service');
const mongoose = require('mongoose'); // Thêm dòng này để kiểm tra ObjectId

// === Controllers cho các hành động cần xác thực ===

// Tạo thiệp mới
const createInvitation = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { templateId, slug, content, design, settings } = req.body;

        if (!templateId || !slug || !content) {
            return res.status(400).json({ message: 'Template ID, slug, và content là bắt buộc.' });
        }

        const newInvitation = await invitationService.createInvitationFromTemplate(
            userId, templateId, slug, content, design, settings
        );
        res.status(201).json(newInvitation);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Slug này đã được sử dụng. Vui lòng chọn một slug khác.' });
        }
        if (error.message.includes('Không tìm thấy')) {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

// Lấy tất cả thiệp của người dùng đang đăng nhập
const getMyInvitations = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const invitations = await invitationService.getInvitationsByUserId(userId);
        res.status(200).json(invitations);
    } catch (error) {
        next(error);
    }
};

// Lấy chi tiết một thiệp (yêu cầu quyền sở hữu)
const getInvitation = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const invitation = await invitationService.getInvitationByIdAndUser(req.params.id, userId);
        if (!invitation) {
            return res.status(404).json({ message: 'Không tìm thấy thiệp hoặc bạn không có quyền.' });
        }
        res.status(200).json(invitation);
    } catch (error) {
        next(error);
    }
};

// Cập nhật thiệp
const updateInvitation = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const updatedInvitation = await invitationService.updateInvitation(req.params.id, userId, req.body);
        if (!updatedInvitation) {
            return res.status(404).json({ message: 'Không tìm thấy thiệp hoặc bạn không có quyền.' });
        }
        res.status(200).json(updatedInvitation);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Slug này đã được sử dụng.' });
        }
        next(error);
    }
};

// Xóa thiệp
const deleteInvitation = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const success = await invitationService.deleteInvitation(req.params.id, userId);
        if (!success) {
            return res.status(404).json({ message: 'Không tìm thấy thiệp hoặc bạn không có quyền.' });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// Thêm khách mời
const addGuest = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const invitation = await invitationService.addGuestToInvitation(req.params.id, userId, req.body);
        if (!invitation) {
            return res.status(404).json({ message: 'Không tìm thấy thiệp hoặc bạn không có quyền.' });
        }
        res.status(201).json(invitation.guests);
    } catch (error) {
        next(error);
    }
};

// Cập nhật khách mời
const updateGuest = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { id, guestId } = req.params;
        const invitation = await invitationService.updateGuestInInvitation(id, guestId, userId, req.body);
        if (!invitation) {
            return res.status(404).json({ message: 'Không tìm thấy thiệp hoặc khách mời.' });
        }
        res.status(200).json(invitation.guests.id(guestId));
    } catch (error) {
        next(error);
    }
};

// Xóa khách mời
const removeGuest = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { id, guestId } = req.params;
        const invitation = await invitationService.removeGuestFromInvitation(id, guestId, userId);
        if (!invitation) {
            return res.status(404).json({ message: 'Không tìm thấy thiệp hoặc khách mời.' });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};


// === Controllers cho các hành động công khai ===

// Lấy thiệp công khai bằng slug
const getPublicInvitationBySlug = async (req, res, next) => {
    try {
        const invitation = await invitationService.getInvitationBySlug(req.params.slug);
        if (!invitation) {
            return res.status(404).json({ message: 'Không tìm thấy thiệp mời.' });
        }
        // Logic kiểm tra mật khẩu có thể được thêm ở đây nếu cần
        // Ví dụ: if (invitation.settings.password && invitation.settings.password !== req.body.password) { ... }
        res.status(200).json(invitation);
    } catch (error) {
        next(error);
    }
};

// Thêm lời chúc
const addWish = async (req, res, next) => {
    try {
        const invitation = await invitationService.addWishToInvitation(req.params.id, req.body);
        res.status(201).json(invitation.wishes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// MỚI: Controller để cập nhật cài đặt thiệp
const updateInvitationSettings = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const invitationId = req.params.id;
        const settingsData = req.body;

        const updatedInvitation = await invitationService.updateInvitationSettings(invitationId, userId, settingsData);

        if (!updatedInvitation) {
            return res.status(404).json({ message: 'Không tìm thấy thiệp hoặc bạn không có quyền.' });
        }

        res.status(200).json({
            success: true,
            message: 'Cài đặt thiệp đã được cập nhật thành công.',
            data: updatedInvitation.settings, // Trả về chỉ các cài đặt đã cập nhật
        });
    } catch (error) {
        next(error);
    }
};

// --- MỚI: Controllers cho Quản lý Nhóm khách mời ---

const getGuestGroups = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const invitationId = req.params.id;
        
        if (!mongoose.Types.ObjectId.isValid(invitationId)) {
            return res.status(400).json({ message: 'ID thiệp không hợp lệ.' });
        }

        const groups = await invitationService.getGuestGroupsByInvitationId(invitationId, userId);
        res.status(200).json({
            status: 'success',
            results: groups.length,
            data: groups,
        });
    } catch (error) {
        if (error.message.includes('Không tìm thấy thiệp')) {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

const addGuestGroup = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const invitationId = req.params.id;
        const { name, salutation } = req.body;

        if (!name || !salutation) {
            return res.status(400).json({ message: 'Tên nhóm và lời xưng hô là bắt buộc.' });
        }

        if (!mongoose.Types.ObjectId.isValid(invitationId)) {
            return res.status(400).json({ message: 'ID thiệp không hợp lệ.' });
        }

        const updatedInvitation = await invitationService.addGuestGroupToInvitation(invitationId, userId, { name, salutation });
        res.status(201).json({
            status: 'success',
            data: updatedInvitation.guestGroups[updatedInvitation.guestGroups.length - 1], // Trả về nhóm vừa thêm
        });
    } catch (error) {
        // Cụ thể hóa lỗi để frontend có thể hiển thị thông báo chính xác hơn
        if (error.message.includes('Không tìm thấy thiệp')) {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes('Tên nhóm đã tồn tại')) {
            return res.status(409).json({ message: error.message }); // 409 Conflict for duplicate
        }
        next(error); // Chuyển các lỗi khác cho middleware xử lý lỗi
    }
};

const updateGuestGroup = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const invitationId = req.params.id;
        const groupId = req.params.groupId; // Từ tham số URL
        const { name, salutation } = req.body; // Dữ liệu cập nhật

        if (!mongoose.Types.ObjectId.isValid(invitationId) || !mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: 'ID thiệp hoặc ID nhóm không hợp lệ.' });
        }

        const updatedInvitation = await invitationService.updateGuestGroupInInvitation(invitationId, groupId, userId, { name, salutation });

        if (!updatedInvitation) {
            return res.status(404).json({ message: 'Không tìm thấy thiệp hoặc nhóm khách mời.' });
        }

        res.status(200).json({
            status: 'success',
            data: updatedInvitation.guestGroups.id(groupId), // Trả về nhóm đã cập nhật
        });
    } catch (error) {
        // Cụ thể hóa lỗi
        if (error.message.includes('Không tìm thấy thiệp') || error.message.includes('Không tìm thấy nhóm')) {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes('Tên nhóm đã tồn tại')) {
            return res.status(409).json({ message: error.message });
        }
        next(error);
    }
};

const removeGuestGroup = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const invitationId = req.params.id;
        const groupId = req.params.groupId;

        if (!mongoose.Types.ObjectId.isValid(invitationId) || !mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: 'ID thiệp hoặc ID nhóm không hợp lệ.' });
        }

        const updatedInvitation = await invitationService.removeGuestGroupFromInvitation(invitationId, groupId, userId);

        if (!updatedInvitation) {
            return res.status(404).json({ message: 'Không tìm thấy thiệp hoặc nhóm khách mời.' });
        }

        res.status(204).send(); // Không có nội dung cho việc xóa thành công
    } catch (error) {
        if (error.message.includes('Không tìm thấy thiệp') || error.message.includes('Không tìm thấy nhóm')) {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

const sendInvitationEmailToGuest = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { id: invitationId, guestId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(invitationId) || !mongoose.Types.ObjectId.isValid(guestId)) {
            return res.status(400).json({ message: 'ID thiệp hoặc ID khách mời không hợp lệ.' });
        }

        const updatedGuest = await invitationService.sendInvitationEmailToGuest(invitationId, guestId, userId);
        
        res.status(200).json({
            status: 'success',
            message: 'Email đã được gửi thành công.',
            data: updatedGuest,
        });
    } catch (error) {
        if (error.message.includes('Không tìm thấy thiệp') || error.message.includes('Không tìm thấy khách mời')) {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes('Khách mời không có địa chỉ email')) {
            return res.status(400).json({ message: error.message });
        }
        next(error); // Chuyển các lỗi khác cho middleware xử lý lỗi
    }
};

module.exports = {
    createInvitation,
    getMyInvitations,
    getInvitation,
    updateInvitation,
    deleteInvitation,
    addGuest,
    updateGuest,
    removeGuest,
    getPublicInvitationBySlug,
    addWish,
    updateInvitationSettings, // NEW
    getGuestGroups, // NEW
    addGuestGroup, // NEW
    updateGuestGroup, // NEW
    removeGuestGroup, // NEW
    sendInvitationEmailToGuest,
};
