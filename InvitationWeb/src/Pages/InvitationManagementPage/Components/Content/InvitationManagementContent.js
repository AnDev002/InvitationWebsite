// File: InvitationManagementContent.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Giả sử bạn có file api service
import api from '../../../../services/api'; 
import './InvitationManagementContent.css';

// ----- CÁC ICON (GIỮ NGUYÊN) -----
const AddIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const GroupIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);
const ExportIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>);
const EditIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
const DeleteIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>);
const BackArrowIcon = () => (<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>);
const ImagePlaceholderIcon = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>);
const DropdownArrowIcon = () => (<svg width="8.7px" height="5.7px" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const CloseIcon = () => (<svg width="13.4px" height="13.4px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const RequiredIcon = () => (<svg width="12px" height="12px" viewBox="0 0 24 24" fill="red"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>);
const SaveIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>);
const CancelIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const SendEmailIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>);


{/* ----- Custom Hook for Media Query ----- */}
const useMediaQuery = (width) => {
    const [targetReached, setTargetReached] = useState(false);

    const updateTarget = useCallback((e) => {
        setTargetReached(e.matches);
    }, []);

    useEffect(() => {
        const media = window.matchMedia(`(max-width: ${width}px)`);
        media.addEventListener('change', updateTarget);

        // Set initial value
        setTargetReached(media.matches);

        return () => media.removeEventListener('change', updateTarget);
    }, [updateTarget, width]);

    return targetReached;
};


{/* ----- COMPONENT MODAL CHUNG ----- */}
const Modal = ({ title, children, onClose, size = 'normal' }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className={`modal-container ${size === 'large' ? 'modal-large' : ''}`} onClick={e => e.stopPropagation()}>
             {title && (
                 <div style={{ backgroundColor: "rgba(39,84,138,1)", height: "53.4px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px" }}>
                     <div style={{ fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "20px", color: "rgba(255,255,255,1)", fontWeight: "700" }}>{title}</div>
                     <div onClick={onClose} style={{ color: 'white', backgroundColor: "rgba(255,255,255,0.3)", borderRadius: "59px", width: "29.4px", height: "29.4px", display: "flex", justifyContent: "center", alignItems: "center", cursor: 'pointer' }}>
                         <CloseIcon />
                     </div>
                 </div>
             )}
            <div className="modal-body">{children}</div>
        </div>
    </div>
);

{/* ----- MODAL XÁC NHẬN XÓA ----- */}
const DeleteConfirmationModal = ({ onConfirm, onClose, message = 'Bạn thực sự muốn xóa thiệp mời này?', description = 'Sau khi đã xoá, tất cả dữ liệu liên quan đến thiệp này sẽ không thể khôi phục lại được. Vậy nên, xin vui lòng chắc chắn hành động của mình!' }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div style={{ 
            backgroundColor: "rgba(255,255,255,1)", 
            width: '702px',
            display: "flex",
            flexDirection: "column", 
            justifyContent: "start",
            alignItems: "center",
            gap: "20px", 
            paddingTop: "20px",
            borderRadius: "8px",
            overflow: "hidden"
        }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "20px", textAlign: "center", color: "rgba(39,84,138,1)", fontWeight: "700" }}>
                {message}
            </div>
            <div style={{ fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "16px", textAlign: "center", maxWidth: "650px", color: "rgba(0,0,0,1)", lineHeight: "21px", fontWeight: "500", padding: '0 20px' }}>
                {description}
            </div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center", borderTop: '1px solid #ccc', width: '100%', marginTop: '10px' }}>
                <div onClick={onClose} style={{
                    backgroundColor: "rgba(255,255,255,1)", borderRight: '0.5px solid #ccc', width: "50%", height: "60px", display: "flex", justifyContent: "center", alignItems: "center", cursor: 'pointer', fontWeight: 600, color: 'rgba(39,84,138,1)', fontSize: '16px'
                }}>
                    Hủy
                </div>
                <div onClick={onConfirm} style={{
                    backgroundColor: "rgba(255,255,255,1)", borderLeft: '0.5px solid #ccc', width: "50%", height: "60px", display: "flex", justifyContent: "center", alignItems: "center", cursor: 'pointer', fontWeight: 600, color: 'rgba(39,84,138,1)', fontSize: '16px'
                }}>
                    Xác nhận
                </div>
            </div>
        </div>
    </div>
);


{/* ----- CÁC COMPONENT FORM PHỤ TRỢ ----- */}
const FormField = ({ label, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: '100%' }}>
        <label style={{ fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "16px", color: "rgba(0,0,0,1)", fontWeight: "500" }}>
            {label}
        </label>
        {children}
    </div>
);

const CustomInput = ({ style, ...props }) => (
    <input 
        {...props} 
        style={{ 
            border: "0.5px solid rgb(128,128,128)", 
            height: "40px", 
            width: "100%", 
            padding: "0 20px", 
            boxSizing: 'border-box', 
            fontFamily: "'SVN-Gilroy', sans-serif", 
            fontSize: "16px",
            borderRadius: '4px',
            ...style 
        }} 
    />
);

const CustomSelect = ({ children, style, ...props }) => (
    <div style={{ position: 'relative' }}>
        <select 
            {...props} 
            style={{ 
                border: "0.5px solid rgb(128,128,128)", 
                height: "40px", 
                width: "100%", 
                padding: "0 20px", 
                boxSizing: 'border-box', 
                fontFamily: "'SVN-Gilroy', sans-serif", 
                fontSize: "16px", 
                appearance: 'none', 
                WebkitAppearance: 'none',
                borderRadius: '4px',
                ...style
            }}
        >
            {children}
        </select>
        <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <DropdownArrowIcon />
        </div>
    </div>
);


{/* ----- FORM THÊM/SỬA KHÁCH MỜI ----- */}
const GuestForm = ({ invitationId, onSave, onClose, guestToEdit }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [group, setGroup] = useState('');
    const [status, setStatus] = useState('pending');
    const [attendingCount, setAttendingCount] = useState(1);
    const [giftAmount, setGiftAmount] = useState('');
    const [giftUnit, setGiftUnit] = useState('VND');
    const [salutation, setSalutation] = useState('');
    const [availableGroups, setAvailableGroups] = useState([]); // State mới cho nhóm khách mời

    const availableSalutations = ['Lời xưng hô mặc định', 'Thân gửi', 'Trân trọng kính mời'];

    // Fetch groups when component mounts or invitationId changes
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await api.get(`/invitations/${invitationId}/guest-groups`);
                setAvailableGroups(response.data.data); // data.data vì backend trả về {status, results, data}
            } catch (error) {
                console.error("Lỗi khi tải danh sách nhóm:", error);
                // Optionally, set a default list if fetching fails
                setAvailableGroups([]); 
            }
        };
        if (invitationId) {
            fetchGroups();
        }
    }, [invitationId]);

    useEffect(() => {
        if (guestToEdit) {
            setName(guestToEdit.name || '');
            setPhone(guestToEdit.phone || '');
            setEmail(guestToEdit.email || '');
            setGroup(guestToEdit.group || '');
            setStatus(guestToEdit.status || 'pending');
            setAttendingCount(guestToEdit.attendingCount || 1);
            setGiftAmount(guestToEdit.giftAmount || '');
            setGiftUnit(guestToEdit.giftUnit || 'VND');
            setSalutation(guestToEdit.salutation || '');
        }
    }, [guestToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const guestData = { name, phone, email, group, status, attendingCount, giftAmount: giftAmount ? parseFloat(giftAmount) : 0, giftUnit, salutation };
        try {
            if (guestToEdit) {
                await api.put(`/invitations/${invitationId}/guests/${guestToEdit._id}`, guestData);
            } else {
                await api.post(`/invitations/${invitationId}/guests`, guestData);
            }
            onSave(); // Refetch invitation data including guests
            onClose();
        } catch (error) {
            console.error("Lỗi khi lưu khách mời:", error);
            // alert(`Lưu khách mời thất bại: ${error.response?.data?.message || error.message}`);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "row", gap: "20px", padding: '20px' }}>
                {/* Cột trái */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                    <FormField label="Nhóm khách mời">
                           <CustomSelect value={group} onChange={e => setGroup(e.target.value)}>
                               <option value="">Chọn nhóm</option>
                               {availableGroups.map(g => <option key={g._id} value={g.name}>{g.name}</option>)}
                           </CustomSelect>
                    </FormField>
                    <FormField label="Tên khách mời">
                        <CustomInput type="text" placeholder="Nhập tên khách mời" value={name} onChange={e => setName(e.target.value)} />
                    </FormField>
                    <FormField label="Số điện thoại">
                        <CustomInput type="tel" placeholder="Nhập số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} />
                    </FormField>
                    <FormField label="Trạng thái tham gia">
                        <CustomSelect value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="pending">Chưa xác nhận</option>
                            <option value="attending">Sẽ tham gia</option>
                            <option value="declined">Không tham gia</option>
                        </CustomSelect>
                    </FormField>
                </div>

                {/* Cột phải */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                    <FormField label="Địa chỉ Email">
                        <CustomInput type="email" placeholder="Nhập email" value={email} onChange={e => setEmail(e.target.value)} />
                    </FormField>
                    <FormField label="Đi cùng">
                        <CustomSelect value={attendingCount} onChange={e => setAttendingCount(parseInt(e.target.value))}>
                            {[...Array(10).keys()].map(i => <option key={i+1} value={i+1}>{i+1} người</option>)}
                        </CustomSelect>
                    </FormField>
                    <FormField label="Tiền mừng">
                        <div style={{display: 'flex', gap: '10px'}}>
                            <CustomInput type="number" placeholder="Số tiền hoặc phân vàng" value={giftAmount} onChange={e => setGiftAmount(e.target.value)} style={{flex: 3}} />
                            <CustomSelect value={giftUnit} onChange={e => setGiftUnit(e.target.value)} style={{flex: 2}}>
                                <option value="VND">VND</option>
                                <option value="Phân vàng">Phân vàng</option>
                            </CustomSelect>
                        </div>
                    </FormField>
                    <FormField label="Kiểu hiển thị lời xưng hô">
                        <CustomSelect value={salutation} onChange={e => setSalutation(e.target.value)}>
                               {availableSalutations.map(s => <option key={s} value={s}>{s}</option>)}
                        </CustomSelect>
                    </FormField>
                </div>
            </div>

            <div style={{ display: "flex", gap: "20px", padding: "0 20px 20px 20px", borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <button type="submit" style={{ backgroundColor: "rgba(39,84,138,1)", color: "white", flex: 1, height: "40px", border: 'none', cursor: 'pointer', textTransform: 'uppercase', fontWeight: 600, borderRadius: '4px' }}>
                    Lưu thông tin
                </button>
                <button type="button" onClick={onClose} style={{ border: "0.5px solid rgb(128,128,128)", flex: 1, height: "40px", backgroundColor: 'white', cursor: 'pointer', textTransform: 'uppercase', fontWeight: 600, borderRadius: '4px' }}>
                    Hủy
                </button>
            </div>
        </form>
    );
};

{/* ----- FORM QUẢN LÝ NHÓM ----- */}
const ManageGroupsForm = ({ invitationId, onClose, onDataChange }) => { 
    const [groups, setGroups] = useState([]); 
    
    // Đổi tên biến để phản ánh việc chúng được sử dụng cho cả nhập liệu và lọc
    const [newGroupName, setNewGroupName] = useState(''); // Đây sẽ là input chính cho tên nhóm
    const [newGroupSalutation, setNewGroupSalutation] = useState('Thân gửi'); // Đây sẽ là input chính cho lời xưng hô

    // Loại bỏ state `isAdding` vì không cần form ẩn/hiện nữa
    // const [isAdding, setIsAdding] = useState(false); 

    const [editingGroupId, setEditingGroupId] = useState(null); 
    const [editedName, setEditedName] = useState('');
    const [editedSalutation, setEditedSalutation] = useState('');

    const [groupToDelete, setGroupToDelete] = useState(null); 

    const availableSalutations = ['Thân gửi', 'Kính mời', 'Trân trọng kính mời'];

    const fetchGroups = useCallback(async () => {
        if (!invitationId) return;
        try {
            const response = await api.get(`/invitations/${invitationId}/guest-groups`);
            setGroups(response.data.data); 
        } catch (error) {
            console.error("Lỗi khi tải danh sách nhóm:", error);
        }
    }, [invitationId]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const handleDeleteGroupRequest = (groupId) => {
        setGroupToDelete(groupId);
    };

    const confirmDeleteGroup = async () => {
        if (!groupToDelete) return;
        try {
            await api.delete(`/invitations/${invitationId}/guest-groups/${groupToDelete}`);
            fetchGroups(); 
            onDataChange(); 
        } catch (error) {
            console.error("Lỗi khi xóa nhóm:", error);
            alert(`Xóa nhóm thất bại: ${error.response?.data?.message || error.message}`); 
        } finally {
            setGroupToDelete(null);
        }
    };

    // Hàm này bây giờ sẽ được gọi trực tiếp bởi nút "Thêm mới"
    const handleAddOrFilterGroup = async () => { // Đổi tên hàm cho rõ ràng hơn
        if (!newGroupName.trim()) { // Sử dụng newGroupName từ input chính
            alert('Tên nhóm không được để trống.'); 
            return;
        }
        try {
            await api.post(`/invitations/${invitationId}/guest-groups`, { 
                name: newGroupName, 
                salutation: newGroupSalutation 
            });
            fetchGroups(); 
            onDataChange(); 
            setNewGroupName(''); // Reset input sau khi thêm thành công
            setNewGroupSalutation('Thân gửi'); // Reset select sau khi thêm thành công
            alert('Thêm nhóm thành công!'); // Thông báo thành công
        } catch (error) {
            console.error("Lỗi khi thêm nhóm mới:", error);
            alert(`Thêm nhóm thất bại: ${error.response?.data?.message || error.message}`); 
        }
    };

    const handleEditClick = (group) => {
        setEditingGroupId(group._id); 
        setEditedName(group.name);
        setEditedSalutation(group.salutation);
    };

    const handleCancelEdit = () => {
        setEditingGroupId(null);
    };

    const handleSaveEdit = async (groupId) => {
        if (!editedName.trim()) {
            alert('Tên nhóm không được để trống.'); 
            return;
        }
        try {
            await api.put(`/invitations/${invitationId}/guest-groups/${groupId}`, { 
                name: editedName, 
                salutation: editedSalutation 
            });
            fetchGroups(); 
            onDataChange(); 
            setEditingGroupId(null); 
        } catch (error) {
            console.error("Lỗi khi cập nhật nhóm:", error);
            alert(`Cập nhật nhóm thất bại: ${error.response?.data?.message || error.message}`); 
        }
    };
    
    return (
        <div style={{ backgroundColor: "rgba(255,255,255,1)", display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "start", gap: "20px", padding: '20px' }}>
            {/* Thanh nhập liệu và nút thêm mới */}
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center", gap: "20px", width: "100%" }}>
                {/* Các trường nhập liệu chính cho việc thêm nhóm */}
                <input 
                    className="filter-input" // Giữ nguyên class nếu bạn muốn giữ style
                    style={{ flex: 1 }} 
                    placeholder="Nhập tên nhóm mới..." // Thay đổi placeholder cho rõ ràng
                    value={newGroupName} // Liên kết với state newGroupName
                    onChange={(e) => setNewGroupName(e.target.value)} // Cập nhật newGroupName
                />
                <select 
                    className="filter-select" // Giữ nguyên class nếu bạn muốn giữ style
                    style={{ flex: 1 }}
                    value={newGroupSalutation} // Liên kết với state newGroupSalutation
                    onChange={(e) => setNewGroupSalutation(e.target.value)} // Cập nhật newGroupSalutation
                >
                    {/* Các option cho lời xưng hô */}
                    {availableSalutations.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {/* Nút "Thêm mới" gọi hàm handleAddOrFilterGroup */}
                <button 
                    type="button" 
                    onClick={handleAddOrFilterGroup} // Gọi hàm xử lý thêm nhóm
                    className="guest-action-btn" 
                    style={{width: '180px', backgroundColor: '#27548a', color: 'white'}}
                > 
                    <AddIcon /> <span>Thêm mới</span>
                </button>
            </div>

            {/* Loại bỏ phần `isAdding && (...)` */}
            {/* <div style={{ 
                width: '100%', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', 
                marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '16px',
                backgroundColor: '#f9f9f9', boxSizing: 'border-box'
            }}>
                <h4 style={{ margin: 0, fontWeight: '600', color: '#27548a' }}>Thêm nhóm khách mời mới</h4>
                <FormField label="Tên nhóm mới">
                    <CustomInput value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Ví dụ: Bạn thân cô dâu..." />
                </FormField>
                <FormField label="Kiểu hiển thị lời xưng hô cho nhóm">
                       <CustomSelect value={newGroupSalutation} onChange={(e) => setNewGroupSalutation(e.target.value)}>
                            {availableSalutations.map(s => <option key={s} value={s}>{s}</option>)}
                       </CustomSelect>
                </FormField>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button type="button" onClick={() => setIsAdding(false)} style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'white' }}>Hủy</button>
                    <button type="button" onClick={handleSaveNewGroup} style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#27548a', color: 'white' }}>Lưu nhóm</button>
                </div>
            </div> */}

            {/* Bảng danh sách nhóm */}
            <div style={{ width: '100%', marginTop: '20px' }}>
                {/* Header của bảng */}
                <div style={{ display: "flex", flexDirection: "row", borderBottom: '2px solid #ccc', paddingBottom: '8px' }}>
                    <div className="table-header-cell" style={{ width: "60px", flexShrink: 0, justifyContent: 'center' }}>#</div>
                    <div className="table-header-cell" style={{ flex: 2, justifyContent: 'start', padding: '0 20px' }}>TÊN NHÓM</div>
                    <div className="table-header-cell" style={{ flex: 3, justifyContent: 'start', padding: '0 20px' }}>KIỂU HIỂN THỊ LỜI XƯNG HÔ</div>
                    <div className="table-header-cell" style={{ flex: 1, justifyContent: 'center' }}>TÁC VỤ</div>
                </div>
                
                {/* Các hàng dữ liệu của bảng */}
                {groups.map((group, index) => (
                    <div key={group._id} style={{ 
                        display: "flex", flexDirection: "row", 
                        backgroundColor: index % 2 !== 0 ? 'rgba(239,239,239,0.5)' : 'white',
                        borderBottom: '1px solid #e0e0e0', minHeight: '60px', alignItems: 'center'
                    }}>
                        {editingGroupId === group._id ? ( 
                            // --- Chế độ chỉnh sửa ---
                            <>
                                <div className="table-body-cell" style={{ width: "60px", flexShrink: 0, justifyContent: 'center' }}>{index + 1}</div>
                                <div className="table-body-cell" style={{ flex: 2, padding: '5px 10px' }}>
                                    <CustomInput value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                                </div>
                                <div className="table-body-cell" style={{ flex: 3, padding: '5px 10px' }}>
                                    <CustomSelect value={editedSalutation} onChange={(e) => setEditedSalutation(e.target.value)}>
                                        {availableSalutations.map(s => <option key={s} value={s}>{s}</option>)}
                                    </CustomSelect>
                                </div>
                                <div className="table-body-cell" style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', gap: '8px' }}>
                                    <button type="button" className="table-action-btn" onClick={() => handleSaveEdit(group._id)}><SaveIcon /></button>
                                    <button type="button" className="table-action-btn" onClick={handleCancelEdit}><CancelIcon /></button>
                                </div>
                            </>
                        ) : (
                            // --- Chế độ hiển thị ---
                            <>
                                <div className="table-body-cell" style={{ width: "60px", flexShrink: 0, justifyContent: 'center' }}>{index + 1}</div>
                                <div className="table-body-cell" style={{ flex: 2, justifyContent: 'start', padding: '5px 20px' }}>{group.name}</div>
                                <div className="table-body-cell" style={{ flex: 3, justifyContent: 'start', padding: '5px 20px' }}>{group.salutation}</div>
                                <div className="table-body-cell" style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', gap: '8px' }}>
                                    <button type="button" className="table-action-btn" onClick={() => handleEditClick(group)}> <EditIcon /> </button>
                                    <button type="button" className="table-action-btn" onClick={() => handleDeleteGroupRequest(group._id)}> <DeleteIcon /> </button>
                                    <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {groupToDelete && (
                <DeleteConfirmationModal
                    onClose={() => setGroupToDelete(null)}
                    onConfirm={confirmDeleteGroup}
                    message="Bạn thực sự muốn xóa nhóm khách mời này?"
                    description="Việc xóa nhóm sẽ không xóa khách mời thuộc nhóm đó, nhưng khách mời sẽ không còn thuộc nhóm nào. Bạn có chắc chắn muốn tiếp tục?"
                />
            )}
        </div>
    );
};

{/* ----- NEW: Guest Card Component for Mobile/Tablet ----- */}
const GuestCard = ({ guest, onEdit, onDelete, onSendEmail, index }) => { // Thêm onSendEmail
    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

    const getEmailStatusText = (status) => {
        switch (status) {
            case 'Đã gửi': return 'Đã gửi Email';
            case 'Thất bại': return 'Gửi thất bại';
            default: return 'Chưa gửi Email';
        }
    };

    return (
        <div className="guest-card">
            <div className="guest-card-header">
                <div className="guest-card-number">#{index + 1}</div>
                <div className="guest-card-actions">
                    Thêm nút Gửi Email
                    {guest.email && ( // Chỉ hiển thị nút nếu có email
                        <button className="guest-card-action-btn" onClick={() => onSendEmail(guest)}>
                            <SendEmailIcon /> Gửi Email
                        </button>
                    )}
                    <button className="guest-card-action-btn" onClick={() => onEdit(guest)}>
                        <EditIcon /> Sửa
                    </button>
                    <button className="guest-card-action-btn" onClick={() => onDelete(guest._id)}>
                        <DeleteIcon /> Xóa
                    </button>
                </div>
            </div>
            <div className="guest-card-body">
                <div className="guest-info-item">
                    <span className="guest-info-label">Tên khách mời:</span>
                    <span className="guest-info-value guest-name">{guest.name}</span>
                </div>
                {guest.email && (
                    <div className="guest-info-item">
                        <span className="guest-info-label">Email:</span>
                        <span className="guest-info-value">{guest.email}</span>
                    </div>
                )}
                 {guest.phone && (
                    <div className="guest-info-item">
                        <span className="guest-info-label">Điện thoại:</span>
                        <span className="guest-info-value">{guest.phone}</span>
                    </div>
                )}
                <div className="guest-info-item">
                    <span className="guest-info-label">Nhóm:</span>
                    <div className="group-tag-mobile">{guest.group || 'Chưa phân loại'}</div>
                </div>
                <div className="guest-info-item">
                    <span className="guest-info-label">Trạng thái:</span>
                    <span className="guest-info-value">
                        {guest.status === 'attending' ? 'Có' : (guest.status === 'declined' ? 'Không' : 'Chờ')}
                    </span>
                </div>
                <div className="guest-info-item">
                    <span className="guest-info-label">Đi cùng:</span>
                    <span className="guest-info-value">{guest.attendingCount || 0}</span>
                </div>
                <div className="guest-info-item">
                    <span className="guest-info-label">Mừng cưới:</span>
                    <span className="guest-info-value">{formatCurrency(guest.giftAmount)}</span>
                </div>
                <div className="guest-info-item">
                    <span className="guest-info-label">Trạng thái Email:</span>
                    <span className="guest-info-value">{getEmailStatusText(guest.emailStatus)}</span> {/* Cập nhật trạng thái email */}
                </div>
            </div>
        </div>
    );
};

{/* ----- PANEL QUẢN LÝ KHÁCH MỜI ----- */}
const GuestManagementPanel = ({ invitationId, guests = [], onDataChange }) => {
    const [editingGuest, setEditingGuest] = useState(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isManageGroupsModalOpen, setManageGroupsModalOpen] = useState(false);
    const [guestToDelete, setGuestToDelete] = useState(null);
    const [emailSendStatus, setEmailSendStatus] = useState({}); // New state to track email sending status for each guest

    const isMobileOrTablet = useMediaQuery(768); // Use 768px as the breakpoint for mobile/tablet view

    const handleDeleteRequest = (guestId) => {
        setGuestToDelete(guestId);
    };

    const confirmDeleteGuest = async () => {
        if (!guestToDelete) return;
        try {
            await api.delete(`/invitations/${invitationId}/guests/${guestToDelete}`);
            onDataChange();
        } catch (error) {
            console.error("Lỗi khi xóa khách mời:", error);
            // alert("Xóa khách mời thất bại.");
        } finally {
            setGuestToDelete(null);
        }
    };

    const openEditModal = (guest) => {
        setEditingGuest(guest);
        setAddModalOpen(true);
    };

    const openAddModal = () => {
        setEditingGuest(null);
        setAddModalOpen(true);
    };
    
    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

    const stats = {
        total: guests.length,
        attending: guests.filter(g => g.status === 'attending').length,
        declined: guests.filter(g => g.status === 'declined').length,
        pending: guests.filter(g => g.status === 'pending' || !g.status).length,
        totalGiftAmount: guests.reduce((sum, g) => sum + (g.giftAmount || 0), 0),
    };

    const StatItem = ({ label, value }) => (
       <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "12px", flex: 1, height: "96px" }}>
            <div style={{ fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "16px", textAlign: "center", color: "rgba(102,102,102,1)", fontWeight: "500" }}>{label}</div>
            <div style={{ fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "20px", textAlign: "center", color: "rgba(39,84,138,1)", textTransform: "uppercase", fontWeight: "700" }}>
                {value}
            </div>
        </div>
    );
    
    const VerticalSeparator = () => <div style={{width: '1px', height: '52px', backgroundColor: '#E0E0E0'}} />;

    const handleSendEmail = async (guest) => {
        if (!guest.email) {
            alert('Khách mời này không có địa chỉ email.');
            return;
        }

        const confirmSend = window.confirm(`Bạn có chắc chắn muốn gửi email thiệp mời tới ${guest.name} (${guest.email})?`);
        if (!confirmSend) {
            return;
        }

        setEmailSendStatus(prev => ({ ...prev, [guest._id]: 'sending' })); // Set status to sending
        try {
            await api.put(`/invitations/${invitationId}/guests/${guest._id}/send-email`);
            alert(`Đã gửi email đến ${guest.name} thành công!`); // Should be a custom modal/toast
            onDataChange(); // Refetch data to update email status in table
        } catch (error) {
            console.error("Lỗi khi gửi email:", error);
            alert(`Gửi email thất bại: ${error.response?.data?.message || error.message}`); // Should be a custom modal/toast
            setEmailSendStatus(prev => ({ ...prev, [guest._id]: 'failed' })); // Set status to failed
        } finally {
            setEmailSendStatus(prev => ({ ...prev, [guest._id]: undefined })); // Clear status after action
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "start", gap: "40px", paddingTop: '20px' }}>
            <div style={{ border: "0.5px solid rgb(128,128,128)", display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "end", gap: "12px", paddingBottom: "20px", width: '100%' }}>
                <div style={{ backgroundColor: "rgba(204,215,229,1)", width: '100%', display: "flex", alignItems: "center", padding: "20px", boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "20px", color: "rgba(39,84,138,1)", textTransform: "uppercase", fontWeight: "700" }}>
                        Danh sách khách mời
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "0 20px", width: "100%", boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "16px", color: "rgba(0,0,0,1)", fontWeight: "500" }}>
                        Gửi thiệp mời qua Email
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                        <button onClick={openAddModal} className="guest-action-btn"> <AddIcon /> <span>Thêm khách mời</span> </button>
                        <button onClick={() => setManageGroupsModalOpen(true)} className="guest-action-btn"> <GroupIcon /> <span>Quản lý nhóm</span> </button>
                        <button className="guest-action-btn"> <ExportIcon /> <span>Xuất danh sách</span> </button>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "start", gap: "20px", width: '100%' }}>
                <div style={{ display: "flex", flexDirection: "row", gap: "20px", width: "100%" }}>
                    <input className="filter-input" placeholder="Tìm kiếm khách mời..."/>
                    <select className="filter-select"> <option>Tất cả nhóm</option> </select>
                    <select className="filter-select"> <option>Trạng thái tham gia</option> </select>
                    <select className="filter-select"> <option>Trạng thái Email</option> </select>
                </div>

                <div style={{ backgroundColor: "#fff", boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.3)", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: '100%' }}>
                    <StatItem label="Tổng số khách mời" value={stats.total} /> <VerticalSeparator />
                    <StatItem label="Tham gia" value={stats.attending} /> <VerticalSeparator />
                    <StatItem label="Không tham gia" value={stats.declined} /> <VerticalSeparator />
                    <StatItem label="Không xác nhận" value={stats.pending} /> <VerticalSeparator />
                    <StatItem label="Tiền mừng" value={formatCurrency(stats.totalGiftAmount)} /> <VerticalSeparator />
                    <StatItem label="Vàng mừng" value={"N/A"} />
                </div>

                {isMobileOrTablet ? (
                    // Mobile/Tablet View: Render GuestCard components
                    <div className="guest-cards-container">
                        {guests.map((guest, index) => (
                            <GuestCard 
                                key={guest._id} 
                                guest={guest} 
                                onEdit={openEditModal} 
                                onDelete={handleDeleteRequest} 
                                onSendEmail={handleSendEmail} // Pass the send email handler
                                index={index} // Pass index for numbering
                            />
                        ))}
                    </div>
                ) : (
                    // Desktop View: Render the traditional table
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center", width: '100%' }}>
                            <div className="table-header-cell" style={{width: "60px"}}>#</div>
                            <div className="table-header-cell" style={{width: "83px"}}>Thiệp</div>
                            <div className="table-header-cell" style={{width: "92px"}}>Mã KM</div>
                            <div className="table-header-cell" style={{flex: 3, justifyContent: 'start', paddingLeft: '20px'}}>Tên khách mời</div>
                            <div className="table-header-cell" style={{flex: 1.5, justifyContent: 'start', paddingLeft: '20px'}}>Điện thoại</div>
                            <div className="table-header-cell" style={{flex: 2}}>Nhóm khách mời</div>
                            <div className="table-header-cell" style={{flex: 1, justifyContent: 'start', paddingLeft: '20px'}}>Tham gia</div>
                            <div className="table-header-cell" style={{flex: 1, justifyContent: 'start', paddingLeft: '20px'}}>Đi cùng</div>
                            <div className="table-header-cell" style={{flex: 1.5, justifyContent: 'start', paddingLeft: '20px'}}>Mừng cưới</div>
                            <div className="table-header-cell" style={{flex: 2}}>Tác vụ</div> {/* Tăng flex để đủ chỗ cho nút email */}
                        </div>

                        {guests.map((guest, index) => (
                            <div key={guest._id} style={{ display: "flex", justifyContent: "start", alignItems: "center", width: '100%', backgroundColor: index % 2 === 0 ? 'rgba(239,239,239,1)' : 'white' }}>
                                <div className="table-body-cell" style={{width: "60px"}}>{index + 1}</div>
                                <div className="table-body-cell" style={{width: "83px", cursor: "pointer"}} onClick={() => handleSendEmail(guest)}> {invitationId.template?.imgSrc ? <img width="40px" height="auto" src={invitationId.template.imgSrc} alt="thumbnail"/> : <ImagePlaceholderIcon />} </div>
                                <div className="table-body-cell" style={{width: "92px"}}>{"N/A"}</div>
                                <div className="table-body-cell" style={{flex: 3, alignItems: 'flex-start', paddingLeft: '20px'}}>
                                    <div style={{fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "20px", color: "rgba(39,84,138,1)", fontWeight: "700"}}>{guest.name}</div>
                                    <div style={{fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "16px"}}>Email: {guest.email || 'N/A'}</div>
                                    <div style={{fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "16px", color: "rgba(102,102,102,1)"}}>
                                        {/* Hiển thị trạng thái email và nút gửi */}
                                        {emailSendStatus[guest._id] === 'sending' ? (
                                            'Đang gửi...'
                                        ) : (
                                            guest.email ? (
                                                <>
                                                    {guest.emailStatus === 'Đã gửi' ? 'Đã gửi Email' : 'Chưa gửi Email'}
                                                    {guest.emailStatus !== 'Đã gửi' && (<></>
                                                        // <button
                                                        //     className="send-email-btn"
                                                        //     onClick={() => handleSendEmail(guest)}
                                                        //     style={{
                                                        //         marginLeft: '10px',
                                                        //         padding: '5px 10px',
                                                        //         backgroundColor: '#4CAF50',
                                                        //         color: 'white',
                                                        //         border: 'none',
                                                        //         borderRadius: '4px',
                                                        //         cursor: 'pointer',
                                                        //         fontSize: '14px'
                                                        //     }}
                                                        // >
                                                        //     Gửi Email
                                                        // </button>
                                                    )}
                                                </>
                                            ) : 'Không có Email'
                                        )}
                                    </div>
                                </div>
                                <div className="table-body-cell" style={{flex: 1.5, alignItems: 'flex-start', paddingLeft: '20px'}}>{guest.phone || 'N/A'}</div>
                                <div className="table-body-cell" style={{flex: 2}}> <div className="group-tag">{guest.group || 'Chưa phân loại'}</div> </div>
                                <div className="table-body-cell" style={{flex: 1, alignItems: 'flex-start', paddingLeft: '20px'}}>{guest.status === 'attending' ? 'Có' : (guest.status === 'declined' ? 'Không' : 'Chờ')}</div>
                                <div className="table-body-cell" style={{flex: 1, alignItems: 'flex-start', paddingLeft: '20px'}}>{guest.attendingCount || 0}</div>
                                <div className="table-body-cell" style={{flex: 1.5, alignItems: 'flex-start', paddingLeft: '20px'}}>{formatCurrency(guest.giftAmount)}</div>
                                <div className="table-body-cell" style={{flex: 2, flexDirection: 'row', gap: '16px'}}> {/* Tăng flex cho tác vụ */}
                                    <button className="table-action-btn" onClick={() => openEditModal(guest)}> <EditIcon /> </button>
                                    <button className="table-action-btn" onClick={() => handleDeleteRequest(guest._id)}> <DeleteIcon /> </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {isAddModalOpen && (
                <Modal title={editingGuest ? "Cập nhật khách mời" : "Thêm mới khách mời"} onClose={() => setAddModalOpen(false)} size="large" >
                    <GuestForm invitationId={invitationId} onSave={onDataChange} onClose={() => setAddModalOpen(false)} guestToEdit={editingGuest} />
                </Modal>
            )}
            {isManageGroupsModalOpen && (
                <Modal title="Quản lí nhóm khách mời" onClose={() => setManageGroupsModalOpen(false)} size="large" >
                    <ManageGroupsForm invitationId={invitationId} onClose={() => setManageGroupsModalOpen(false)} onDataChange={onDataChange} />
                </Modal>
            )}
             {guestToDelete && (
                <DeleteConfirmationModal
                    onClose={() => setGuestToDelete(null)}
                    onConfirm={confirmDeleteGuest}
                />
            )}
        </div>
    );
};


{/* ----- PANEL QUẢN LÝ LỜI CHÚC ----- */}
const WishManagementPanel = () => (
    <div className="management-content-placeholder">
        <h3>Quản lý lời chúc</h3>
        <p>Tính năng sẽ được cập nhật trong thời gian tới.</p>
    </div>
);


{/* ----- PANEL CÀI ĐẶT THIỆP ----- */}
const InvitationSettingsPanel = ({ invitation, onDataChange }) => {
    const [settings, setSettings] = useState({
        title: '',
        description: '',
        salutationStyle: 'Thân gửi',
        displayStyle: 'Kiểu 1',
        emailSubject: '',
        emailBody: '',
    });

    useEffect(() => {
        if (invitation && invitation.settings) {
            setSettings({
                title: invitation.settings.title || '{LờiXưngHô} {TênKháchMời} ! - Thiệp mời online',
                description: invitation.settings.description || '{LờiXưngHô} {TênKháchMời} đến tham dự buổi tiệc chung vui cùng gia đình chúng tôi!',
                salutationStyle: invitation.settings.salutationStyle || 'Thân gửi',
                displayStyle: invitation.settings.displayStyle || 'Kiểu 1',
                emailSubject: invitation.settings.emailSubject || '{LờiXưngHô} {TênKháchMời} Đến tham dự buổi tiệc cùng gia đình chúng tôi! - Thiệp mời online',
                emailBody: invitation.settings.emailBody || 'Một dấu mốc quan trọng đang đến và chúng tôi rất mong có bạn đồng hành trong khoảnh khắc đáng nhớ này.\nTrân trọng mời bạn tham dự sự kiện đặc biệt của chúng tôi.\nSự hiện diện của bạn là món quà ý nghĩa nhất mà chúng tôi có thể mong chờ!\n\nTrân trọng,\nBiihappy',
            });
        }
    }, [invitation]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prevSettings => ({ ...prevSettings, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/invitations/${invitation._id}/settings`, settings);
            alert('Đã lưu cài đặt thành công!'); // Sử dụng alert tạm thời, nên thay bằng modal
            onDataChange();
        } catch (error) {
            console.error("Lỗi khi lưu cài đặt:", error);
            alert(`Lưu cài đặt thất bại: ${error.response?.data?.message || error.message}`); // Sử dụng alert tạm thời
        }
    };
    
    const SettingsField = ({ label, required, description, children }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "16px", color: "rgba(0,0,0,1)", fontWeight: "600" }}>{label}</div>
                {required && <RequiredIcon />}
            </div>
            {description && (
                     <div style={{ fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "16px", color: "rgba(102,102,102,1)" }}
                     dangerouslySetInnerHTML={{ __html: description }}></div>
            )}
            {children}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} style={{ backgroundColor: "white", width: "100%", maxWidth: '1080px', margin: '40px auto', boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.3)", padding: "40px", boxSizing: 'border-box', display: "flex", flexDirection: "column", gap: "40px" }}>
             <div style={{ backgroundColor: "rgba(204,215,229,1)", padding: "20px", fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "16px", borderRadius: '4px' }}>
                 <span style={{ fontWeight: "700" }}>Lưu ý:</span> Hệ thống sẽ tự động thay đổi cụm từ <code style={{fontWeight: 700}}>&#123;TênKháchMời&#125;</code> và <code style={{fontWeight: 700}}>&#123;LờiXưngHô&#125;</code>.
             </div>

             <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                 <SettingsField label="Tiêu đề thiệp" required>
                     <input name="title" value={settings.title} onChange={handleChange} className="settings-input"/>
                 </SettingsField>

                 <SettingsField label="Mô tả thiệp" required>
                     <input name="description" value={settings.description} onChange={handleChange} className="settings-input"/>
                 </SettingsField>

                 <SettingsField label="Kiểu hiển thị Lời Xưng Hô" required description="Kiểu hiển thị bạn chọn ở đây sẽ sử dụng cho biến: <code>&#123;LờiXưngHô&#125;</code>">
                     <select name="salutationStyle" value={settings.salutationStyle} onChange={handleChange} className="settings-select">
                           <option>Thân gửi</option> <option>Kính mời</option> <option>Trân trọng kính mời</option>
                     </select>
                 </SettingsField>
                 
                 <SettingsField label="Kiểu hiển thị thiệp mời" required>
                     <select name="displayStyle" value={settings.displayStyle} onChange={handleChange} className="settings-select">
                           <option>Kiểu 1</option> <option>Kiểu 2</option>
                     </select>
                 </SettingsField>

                 <SettingsField label="Nội dung gửi thiệp mời qua Email" required description="Nội dung này sử dụng như một lời mời khi bạn gửi thiệp mời qua email.">
                     <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                           <label style={{fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "16px", fontWeight: "500"}}>[ Tiêu đề gửi email ]</label>
                           <input name="emailSubject" value={settings.emailSubject} onChange={handleChange} className="settings-input"/>
                           <label style={{fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "16px", fontWeight: "500", marginTop: '12px'}}>[ Nội dung gửi email ]</label>
                           <textarea name="emailBody" value={settings.emailBody} onChange={handleChange} className="settings-textarea" rows="8"></textarea>
                     </div>
                 </SettingsField>
             </div>
             
             <button type="submit" style={{ backgroundColor: "rgba(39,84,138,1)", width: "100%", height: "60px", color: "white", border: 'none', cursor: 'pointer', fontFamily: "'SVN-Gilroy', sans-serif", fontSize: "16px", textTransform: "uppercase", fontWeight: "600", borderRadius: '4px' }}>
                 Lưu thông tin
             </button>
        </form>
    );
};


{/* ----- VIEW CHI TIẾT ----- */}
const InvitationDetailView = ({ invitation, onGoBack, onDelete, onDataChange }) => {
    const [activeTab, setActiveTab] = useState('guests');
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const navigate = useNavigate();

    const tabs = [
        { id: 'guests', title: 'Quản lý khách mời' },
        { id: 'wishes', title: 'Quản lý lời chúc' },
        { id: 'invitation-settings', title: 'Cài đặt thiệp mời' },
        { id: 'confirmation-settings', title: 'Cài đặt xác nhận' },
        { id: 'edit', title: 'Chỉnh sửa thiệp mời' },
        { id: 'delete', title: 'Xóa thiệp mời' },
    ];
    
    const handleTabClick = (tabId) => {
        if (tabId === 'edit') {
            navigate(`/canvas/edit/${invitation._id}`);
        } else if (tabId === 'delete') {
            setDeleteModalOpen(true);
        } else {
            setActiveTab(tabId);
        }
    };
    
    const handleDeleteConfirm = () => {
        onDelete(invitation._id);
        setDeleteModalOpen(false);
    };
    
    const Tab = ({ id, title, isActive, onClick }) => (
        <button onClick={() => onClick(id)} className={`tab-button ${isActive ? 'active' : ''}`}>
            {title}
        </button>
    );

    const PageHeader = () => (
        <div className="page-header-container">
            <button onClick={onGoBack} className="back-button">
                <div className="back-button-icon-wrapper"> <BackArrowIcon /> </div>
                <span>Trở về</span>
            </button>
            <div className="page-header-title">
                <span>{invitation.slug || 'Thiết kế thiệp mời không tên'}</span>
            </div>
        </div>
    );
    
    const renderContent = () => {
        switch (activeTab) {
            case 'guests':
                return <GuestManagementPanel invitationId={invitation._id} guests={invitation.guests} onDataChange={onDataChange} />;
            case 'wishes':
                return <WishManagementPanel/>;
            case 'invitation-settings':
                return <InvitationSettingsPanel invitation={invitation} onDataChange={onDataChange} />;
            case 'confirmation-settings':
                return <div className="management-content-placeholder"><h3>Cài đặt xác nhận</h3><p>Tính năng sẽ được cập nhật trong thời gian tới.</p></div>;
            default:
                return null;
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0", width: '100%' }}>
            <PageHeader />
            <div className="tabs-container">
                {tabs.map(tab => (
                    <Tab key={tab.id} id={tab.id} title={tab.title} isActive={activeTab === tab.id} onClick={handleTabClick} />
                ))}
            </div>
            <div style={{width: '100%', maxWidth: '1520px', margin: '0 auto'}}>
                {renderContent()}
            </div>
            
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    );
};

{/* ----- VIEW DANH SÁCH THIỆP ----- */}
const InvitationListView = ({ invitations, onManageClick }) => {
    return (
        <div className="container">
            <header className="page-header">
                <h2>Thiệp mời của bạn</h2>
                <p>({invitations.length} tấm thiệp bạn đã tạo)</p>
            </header>
            <div className="invitation-grid-wrapper">
                {invitations.map(invitation => (
                     <div key={invitation._id} className="invitation-card-wrapper" onClick={() => onManageClick(invitation)}>
                            <div className="invitation-card-thumbnail">
                             <img src={invitation.template?.imgSrc || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'} alt={invitation.slug}/>
                            </div>
                            <div className="invitation-card-content">
                                <h5>{invitation.slug || 'Thiết kế không tên'}</h5>
                                <button className="btn">Quản lý thiệp</button>
                            </div>
                     </div>
                ))}
            </div>
        </div>
    );
}

{/* ----- COMPONENT CHÍNH ----- */}
const InvitationManagement = () => {
    const { invitationId } = useParams();
    const navigate = useNavigate();
    const [myInvitations, setMyInvitations] = useState([]);
    const [selectedInvitation, setSelectedInvitation] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            if (invitationId) {
                const response = await api.get(`/invitations/${invitationId}`);
                setSelectedInvitation(response.data);
            } else {
                const response = await api.get('/invitations');
                setMyInvitations(response.data);
                setSelectedInvitation(null);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            if (error.response?.status === 401) { navigate('/sign-in'); }
            // Handle other errors, e.g., show a message to the user
        } finally {
            setLoading(false);
        }
    }, [invitationId, navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleManageClick = (invitation) => {
        navigate(`/invitation-management/${invitation._id}`);
    };

    const handleGoBack = () => {
        navigate('/invitation-management');
    };

    const handleDelete = async (idToDelete) => {
        try {
            await api.delete(`/invitations/${idToDelete}`);
            // alert('Xóa thiệp thành công!'); // Should be a custom modal/toast
            navigate('/invitation-management');
        } catch (error) {
            console.error("Lỗi khi xóa thiệp:", error);
            // alert('Xóa thiệp thất bại.'); // Should be a custom modal/toast
        }
    };

    if (loading) {
        return <div className="container"><p>Đang tải dữ liệu...</p></div>;
    }
    
    return (
        <main className="management-page-wrapper">
            {selectedInvitation ? (
                <InvitationDetailView 
                    invitation={selectedInvitation} 
                    onGoBack={handleGoBack}
                    onDelete={handleDelete}
                    onDataChange={fetchData} 
                />
            ) : (
                <InvitationListView 
                    invitations={myInvitations} 
                    onManageClick={handleManageClick} 
                />
            )}
        </main>
    );
};

export default InvitationManagement;