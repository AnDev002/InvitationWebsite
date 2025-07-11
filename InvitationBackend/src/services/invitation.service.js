const Invitation = require('../models/invitation.model');
const InvitationTemplate = require('../models/invitationTemplate.model'); // Import model template
const nodemailer = require('nodemailer'); // Uncomment if using Nodemailer

/**
 * [MỚI]
 * Lấy một thiệp mời công khai bằng slug của nó.
 * Hàm này không yêu cầu xác thực người dùng.
 * @param {string} slug - Slug của thiệp mời.
 * @returns {Promise<Document|null>} Thiệp mời nếu tìm thấy.
 */
const getInvitationBySlug = async (slug) => {
    const invitation = await Invitation.findOne({ slug: slug }).populate('template', 'title');
    if (invitation && invitation.settings.password) {
        // Nếu thiệp có mật khẩu, không trả về thông tin nhạy cảm
        // Ở đây ta có thể chọn chỉ trả về một phần thông tin hoặc một thông báo yêu cầu mật khẩu
        // Hiện tại, ta trả về toàn bộ, logic kiểm tra mật khẩu sẽ ở controller/frontend
    }
    return invitation;
};


/**
 * Tạo một thiệp mời mới từ template.
 * @param {string} userId - ID người dùng.
 * @param {string} templateId - ID của mẫu thiệp được chọn.
 * @param {string} slug - Slug duy nhất cho URL.
 * @param {object} content - Dữ liệu nội dung thiệp từ người dùng.
 * @param {object} design - Tùy chỉnh thiết kế từ người dùng.
 * @param {object} settings - Các cài đặt cho thiệp.
 * @returns {Promise<Document>} Thiệp mời vừa được tạo.
 */
const createInvitationFromTemplate = async (userId, templateId, slug, content, design, settings) => {
    const template = await InvitationTemplate.findById(templateId);
    if (!template) {
        throw new Error('Không tìm thấy mẫu thiệp.');
    }

    const finalDesign = {
        ...(template.templateData?.design || {}),
        ...(design || {}),
    };

    const newInvitation = new Invitation({
        user: userId,
        template: templateId,
        slug: slug,
        content: content, // content (là pages array) được truyền trực tiếp
        design: finalDesign,
        settings: settings || { showWishList: true, showGuestList: false },
    });

    return await newInvitation.save();
};

/**
 * Cập nhật một thiệp mời.
 * @param {string} invitationId - ID của thiệp mời.
 * @param {string} userId - ID của người dùng.
 * @param {object} updateData - Dữ liệu cần cập nhật.
 * @returns {Promise<Document|null>} Thiệp mời đã được cập nhật.
 */
const updateInvitation = async (invitationId, userId, updateData) => {
    const allowedUpdates = {};
    if (updateData.slug) allowedUpdates.slug = updateData.slug;
    if (updateData.content) allowedUpdates.content = updateData.content;
    if (updateData.design) allowedUpdates.design = updateData.design;
    if (updateData.settings) allowedUpdates.settings = updateData.settings;

    return await Invitation.findOneAndUpdate(
        { _id: invitationId, user: userId },
        { $set: allowedUpdates },
        { new: true, runValidators: true }
    );
};

const getInvitationsByUserId = async (userId) => {
    return await Invitation.find({ user: userId }).populate('template', 'title imgSrc');
};

const getInvitationByIdAndUser = async (invitationId, userId) => {
    return await Invitation.findOne({ _id: invitationId, user: userId }).populate('template');
};

const deleteInvitation = async (invitationId, userId) => {
    const result = await Invitation.deleteOne({ _id: invitationId, user: userId });
    return result.deletedCount > 0;
};

// --- Quản lý Khách mời ---

const addGuestToInvitation = async (invitationId, userId, guestData) => {
    const invitation = await Invitation.findOne({ _id: invitationId, user: userId });
    if (!invitation) {
        return null; // Hoặc throw error
    }
    invitation.guests.push(guestData);
    return await invitation.save();
};

/**
 * [MỚI]
 * Cập nhật thông tin một khách mời trong thiệp.
 * @param {string} invitationId - ID của thiệp.
 * @param {string} guestId - ID của khách mời cần cập nhật.
 * @param {string} userId - ID của chủ thiệp.
 * @param {object} guestUpdateData - Dữ liệu mới của khách mời.
 * @returns {Promise<Document|null>} Thiệp mời đã được cập nhật.
 */
const updateGuestInInvitation = async (invitationId, guestId, userId, guestUpdateData) => {
    const invitation = await Invitation.findOne({ _id: invitationId, user: userId });
    if (!invitation) {
        return null;
    }
    const guest = invitation.guests.id(guestId);
    if (!guest) {
        return null;
    }
    guest.set(guestUpdateData);
    return await invitation.save();
};

/**
 * [MỚI]
 * Xóa một khách mời khỏi thiệp.
 * @param {string} invitationId - ID của thiệp.
 * @param {string} guestId - ID của khách mời cần xóa.
 * @param {string} userId - ID của chủ thiệp.
 * @returns {Promise<Document|null>} Thiệp mời đã được cập nhật.
 */
const removeGuestFromInvitation = async (invitationId, guestId, userId) => {
    const invitation = await Invitation.findOne({ _id: invitationId, user: userId });
    if (!invitation) {
        throw new Error('Không tìm thấy thiệp hoặc bạn không có quyền.');
    }

    // Find the index of the guest to remove
    const guestIndex = invitation.guests.findIndex(g => g._id.toString() === guestId);
    if (guestIndex === -1) {
        throw new Error('Không tìm thấy khách mời.'); // Guest not found
    }

    // Remove the guest using splice
    invitation.guests.splice(guestIndex, 1);
    
    return await invitation.save();
};

// --- Quản lý Lời chúc ---

/**
 * [MỚI]
 * Thêm một lời chúc vào thiệp (công khai).
 * @param {string} invitationId - ID của thiệp.
 * @param {object} wishData - Dữ liệu lời chúc (author, message).
 * @returns {Promise<Document|null>} Thiệp mời đã được cập nhật.
 */
const addWishToInvitation = async (invitationId, wishData) => {
    const invitation = await Invitation.findById(invitationId);
    if (!invitation) {
        throw new Error('Không tìm thấy thiệp.');
    }
    if (!invitation.settings.showWishList) {
        throw new Error('Chủ nhân thiệp không cho phép gửi lời chúc.');
    }
    invitation.wishes.push(wishData);
    return await invitation.save();
};

// MỚI: Function để cập nhật cài đặt thiệp
const updateInvitationSettings = async (invitationId, userId, settingsData) => {
    // Đảm bảo chỉ các trường cài đặt được phép được cập nhật
    const allowedSettings = ['showWishList', 'showGuestList', 'password', 'title', 'description', 'salutationStyle', 'displayStyle', 'emailSubject', 'emailBody'];
    const update = {};
    for (const key of allowedSettings) {
        if (settingsData[key] !== undefined) {
            update[`settings.${key}`] = settingsData[key];
        }
    }

    return await Invitation.findOneAndUpdate(
        { _id: invitationId, user: userId },
        { $set: update },
        { new: true, runValidators: true }
    ).populate('template', 'title imgSrc'); // Populated lại template sau khi cập nhật
};


// --- MỚI: Quản lý Nhóm khách mời ---

/**
 * Thêm một nhóm khách mời mới vào thiệp.
 * @param {string} invitationId - ID của thiệp.
 * @param {string} userId - ID của chủ thiệp.
 * @param {object} groupData - Dữ liệu nhóm (name, salutation).
 * @returns {Promise<Document|null>} Thiệp mời đã được cập nhật.
 */
const addGuestGroupToInvitation = async (invitationId, userId, groupData) => {
    const invitation = await Invitation.findOne({ _id: invitationId, user: userId });
    if (!invitation) {
        throw new Error('Không tìm thấy thiệp hoặc bạn không có quyền.');
    }

    // Kiểm tra trùng tên nhóm trong thiệp này
    const existingGroup = invitation.guestGroups.find(g => g.name === groupData.name);
    if (existingGroup) {
        throw new Error('Tên nhóm đã tồn tại.');
    }

    invitation.guestGroups.push(groupData);
    return await invitation.save();
};

/**
 * Lấy tất cả nhóm khách mời của một thiệp.
 * @param {string} invitationId - ID của thiệp.
 * @param {string} userId - ID của chủ thiệp.
 * @returns {Promise<Array>} Mảng các nhóm khách mời.
 */
const getGuestGroupsByInvitationId = async (invitationId, userId) => {
    const invitation = await Invitation.findOne({ _id: invitationId, user: userId }).select('guestGroups');
    if (!invitation) {
        throw new Error('Không tìm thấy thiệp hoặc bạn không có quyền.');
    }
    return invitation.guestGroups;
};

/**
 * Cập nhật thông tin một nhóm khách mời trong thiệp.
 * @param {string} invitationId - ID của thiệp.
 * @param {string} groupId - ID của nhóm cần cập nhật.
 * @param {string} userId - ID của chủ thiệp.
 * @param {object} updateData - Dữ liệu mới của nhóm (name, salutation).
 * @returns {Promise<Document|null>} Thiệp mời đã được cập nhật.
 */
const updateGuestGroupInInvitation = async (invitationId, groupId, userId, updateData) => {
    const invitation = await Invitation.findOne({ _id: invitationId, user: userId });
    if (!invitation) {
        throw new Error('Không tìm thấy thiệp hoặc bạn không có quyền.');
    }

    const group = invitation.guestGroups.id(groupId);
    if (!group) {
        throw new Error('Không tìm thấy nhóm khách mời.');
    }

    // Kiểm tra trùng tên nếu tên đang được cập nhật
    if (updateData.name && updateData.name !== group.name) {
        const existingGroup = invitation.guestGroups.find(g => g.name === updateData.name && g._id.toString() !== groupId);
        if (existingGroup) {
            throw new Error('Tên nhóm đã tồn tại.');
        }
    }

    group.set(updateData);
    return await invitation.save();
};

/**
 * Xóa một nhóm khách mời khỏi thiệp.
 * @param {string} invitationId - ID của thiệp.
 * @param {string} groupId - ID của nhóm cần xóa.
 * @param {string} userId - ID của chủ thiệp.
 * @returns {Promise<Document|null>} Thiệp mời đã được cập nhật.
 */
const removeGuestGroupFromInvitation = async (invitationId, groupId, userId) => {
    const invitation = await Invitation.findOne({ _id: invitationId, user: userId });
    if (!invitation) {
        throw new Error('Không tìm thấy thiệp hoặc bạn không có quyền.');
    }

    // Find the index of the group to remove
    const groupIndex = invitation.guestGroups.findIndex(g => g._id.toString() === groupId);
    if (groupIndex === -1) {
        throw new Error('Không tìm thấy nhóm khách mời.'); // Group not found
    }

    // Remove the group using splice
    invitation.guestGroups.splice(groupIndex, 1);
    
    return await invitation.save();
};

/**
 * MỚI: Gửi email thiệp mời đến một khách mời cụ thể.
 * @param {string} invitationId - ID của thiệp mời.
 * @param {string} guestId - ID của khách mời.
 * @param {string} userId - ID của chủ thiệp.
 * @returns {Promise<Object>} Trả về thông tin khách mời đã được cập nhật trạng thái email.
 */
const sendInvitationEmailToGuest = async (invitationId, guestId, userId) => {
    const invitation = await Invitation.findOne({ _id: invitationId, user: userId });
    if (!invitation) {
        throw new Error('Không tìm thấy thiệp hoặc bạn không có quyền.');
    }

    const guest = invitation.guests.id(guestId);
    if (!guest) {
        throw new Error('Không tìm thấy khách mời.');
    }

    if (!guest.email) {
        throw new Error('Khách mời không có địa chỉ email.');
    }

    const { emailSubject, emailBody, salutationStyle } = invitation.settings;
    const { name, salutation } = guest;

    const finalSubject = (emailSubject || '').replace('{TênKháchMời}', name).replace('{LờiXưngHô}', salutation || salutationStyle);
    const finalBody = (emailBody || '').replace('{TênKháchMời}', name).replace('{LờiXưngHô}', salutation || salutationStyle);

    const redirectButtonHtml = `
        <p style="margin-top: 20px;">
            <a href="https://baotrithangmay.vn/infomation-details" 
            style="display: inline-block; padding: 10px 20px; font-family: Arial, sans-serif; font-size: 16px; color: #ffffff; background-color: #007BFF; border-radius: 5px; text-decoration: none; text-align: center;">
                Tìm hiểu thêm về chúng tôi
            </a>
        </p>
    `;
    const fullHtmlBody = `<p>${finalBody.replace(/\n/g, '<br>')}</p>${redirectButtonHtml}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: guest.email,
        subject: finalSubject,
        html: fullHtmlBody, 
    };

    try {
        await transporter.sendMail(mailOptions);
        guest.emailStatus = 'Đã gửi';
        await invitation.save();
        return guest;
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        guest.emailStatus = 'Thất bại';
        await invitation.save();
        throw new Error('Gửi email thất bại.');
    }
};


module.exports = {
    createInvitationFromTemplate,
    getInvitationBySlug,
    getInvitationsByUserId,
    getInvitationByIdAndUser,
    updateInvitation,
    deleteInvitation,
    addGuestToInvitation,
    updateGuestInInvitation,
    removeGuestFromInvitation,
    addWishToInvitation,
    updateInvitationSettings, // NEW
    addGuestGroupToInvitation, // NEW
    getGuestGroupsByInvitationId, // NEW
    updateGuestGroupInInvitation, // NEW
    removeGuestGroupFromInvitation, // NEW
    sendInvitationEmailToGuest, // MỚI: Gửi email
};
