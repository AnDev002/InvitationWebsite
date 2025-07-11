const InvitationTemplate = require('../models/invitationTemplate.model');

const queryInvitationTemplates = (filter) => {
  // LOG NÀY SẼ CHO BIẾT HÀM CÓ NHẬN ĐÚNG FILTER HAY KHÔNG
  console.log("LOG TRONG SERVICE MẪU THIỆP: filter nhận được là:", JSON.stringify(filter));
  
  return InvitationTemplate.find(filter);
};

module.exports = {
  queryInvitationTemplates,
};