// src/Pages/InvitationDesign/Components/Content/DesignContent.js

import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import api from "../../../../services/api"
import { Box, Typography, Card, CardContent, CardMedia, Grid, IconButton, Drawer, Select, MenuItem, InputLabel, FormControl, Slider, Checkbox, FormControlLabel, Tooltip, Divider, Menu, useMediaQuery, List, ListItem, ListItemText, ListItemIcon, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme, styled, useTheme, alpha } from '@mui/material/styles';
import {
    TextFields as TextFieldsIcon,
    Delete as DeleteIcon,
    ZoomIn as ZoomInIcon,
    ZoomOut as ZoomOutIcon,
    FlipToFront as FlipToFrontIcon,
    FlipToBack as FlipToBackIcon,
    Opacity as OpacityIcon,
    CloudUpload as CloudUploadIcon,
    PhotoLibrary as PhotoLibraryIcon,
    Image as ImageIcon,
    FilterVintage as FilterVintageIcon,
    CropFree as CropFreeIcon,
    Save as SaveIcon,
    Print as PrintIcon,
    Download as DownloadIcon,
    ArrowBack as ArrowBackIcon,
    DesignServices as DesignServicesIcon,
    Style as StyleIcon,
    Category as CategoryIcon,
    Label as LabelIcon,
    PeopleAlt as PeopleAltIcon,
    FileCopy as FileCopyIcon,
    AddCircleOutline as AddCircleOutlineIcon,
    Menu as MenuIcon,
    MoreVert as MoreVertIcon,
    Settings as SettingsIcon,
    Undo as UndoIcon,
    Redo as RedoIcon,
    FolderOpen as FolderOpenIcon,
    ContentCopy as ContentCopyIcon,
    ContentPaste as ContentPasteIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Lock as LockIcon,
    LockOpen as LockOpenIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
    Brightness7 as Brightness7Icon,
    Contrast as ContrastIcon,
    FilterBAndW as FilterBAndWIcon,
    CloudSync as CloudSyncIcon
} from '@mui/icons-material';
import JSZip from 'jszip';
import jsPDF from 'jspdf';

// Constants
const FONT_FAMILIES = ['Arial', 'Times New Roman', 'Verdana', 'Courier New', 'Garamond', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald'];
const BASE_Z_INDEX = 5;

const defaultItemProps = {
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    brightness: 1,
    contrast: 1,
    grayscale: 0,
};

// [ĐÃ XÓA] Các hằng số TEMPLATES, ICON_IMAGES, COMPONENT_IMAGES, TAG_IMAGES đã bị loại bỏ.

const MIN_ITEM_WIDTH = 20;
const MIN_ITEM_HEIGHT = 20;
const HANDLE_SIZE = 12;
const HANDLE_OFFSET = HANDLE_SIZE / 2;


const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3.0;

const LEFT_SIDEBAR_WIDTH_DESKTOP = 240;
const RIGHT_SIDEBAR_WIDTH_DESKTOP = 320;
const MOBILE_DRAWER_WIDTH = '85vw';

const DEFAULT_CANVAS_WIDTH = 800;
const DEFAULT_CANVAS_HEIGHT = 600;
const ROTATION_SNAP_ANGLE = 15;
const SNAP_THRESHOLD = 6; // Snap tolerance in pixels

// Styled components
const Input = styled(TextField)({ '& input[type=number]': { width: '100px' } });
const CanvasWrapper = styled(Box)({ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'auto', touchAction: 'none' });
const CanvasContainer = styled(Box)({
    position: 'relative',
    border: '1px solid #ccc',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden', 
});
const StyledCanvas = styled('canvas')({ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' });
const DraggableItem = styled(motion.div)({ position: 'absolute', cursor: 'grab', '&:active': { cursor: 'grabbing' }, boxSizing: 'border-box' });

const HandleStyles = { position: 'absolute', width: `${HANDLE_SIZE}px`, height: `${HANDLE_SIZE}px`, borderRadius: '50%', border: '1.5px solid white', boxShadow: '0 0 5px rgba(0,0,0,0.3)', zIndex: 20000, boxSizing: 'border-box', cursor: 'default' };
const ResizeHandleStyle = { ...HandleStyles, backgroundColor: '#000000', cursor: 'nwse-resize' };
const RotateHandleStyle = { ...HandleStyles, backgroundColor: '#000000', cursor: 'alias', top: `-${HANDLE_OFFSET + 20}px`, left: `calc(50% - ${HANDLE_OFFSET}px)` };

// Snapping Calculation Utility
const calculateSnapping = (draggedItem, allItems, zoomLevel) => {
    const otherItems = allItems.filter(it => it.id !== draggedItem.id && it.visible !== false);
    let finalX = draggedItem.x;
    let finalY = draggedItem.y;
    const guidesToShow = [];

    const draggedGeom = {
        left: draggedItem.x,
        center: draggedItem.x + draggedItem.width / 2,
        right: draggedItem.x + draggedItem.width,
        top: draggedItem.y,
        middle: draggedItem.y + draggedItem.height / 2,
        bottom: draggedItem.y + draggedItem.height,
    };

    let bestVSnap = { dist: Infinity, guide: 0, newPos: 0 };
    let bestHSnap = { dist: Infinity, guide: 0, newPos: 0 };

    for (const staticItem of otherItems) {
        const staticGeom = {
            left: staticItem.x,
            center: staticItem.x + staticItem.width / 2,
            right: staticItem.x + staticItem.width,
            top: staticItem.y,
            middle: staticItem.y + staticItem.height / 2,
            bottom: staticItem.y + staticItem.height,
        };

        const vPoints = ['left', 'center', 'right'];
        const hPoints = ['top', 'middle', 'bottom'];

        vPoints.forEach(dPoint => {
            vPoints.forEach(sPoint => {
                const dist = Math.abs(draggedGeom[dPoint] - staticGeom[sPoint]);
                if (dist < bestVSnap.dist) {
                    bestVSnap = {
                        dist,
                        guide: staticGeom[sPoint],
                        newPos: staticGeom[sPoint] - (draggedGeom[dPoint] - draggedGeom.left)
                    };
                }
            });
        });

        hPoints.forEach(dPoint => {
            hPoints.forEach(sPoint => {
                const dist = Math.abs(draggedGeom[dPoint] - staticGeom[sPoint]);
                if (dist < bestHSnap.dist) {
                    bestHSnap = {
                        dist,
                        guide: staticGeom[sPoint],
                        newPos: staticGeom[sPoint] - (draggedGeom[dPoint] - draggedGeom.top)
                    };
                }
            });
        });
    }

    if (bestVSnap.dist * zoomLevel < SNAP_THRESHOLD) {
        finalX = bestVSnap.newPos;
        guidesToShow.push({ type: 'v', x: bestVSnap.guide });
    }
    if (bestHSnap.dist * zoomLevel < SNAP_THRESHOLD) {
        finalY = bestHSnap.newPos;
        guidesToShow.push({ type: 'h', y: bestHSnap.guide });
    }

    return { snappedX: finalX, snappedY: finalY, guides: guidesToShow };
};


// Custom theme
const editorTheme = createTheme({
    palette: {
        primary: {
            main: '#000000',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#333333',
            contrastText: '#ffffff',
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        button: {
            textTransform: 'none'
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                outlinedPrimary: {
                    borderColor: '#000000',
                    color: '#000000',
                    '&:hover': {
                        borderColor: alpha('#000000', 0.7),
                        backgroundColor: alpha('#000000', 0.04),
                    }
                }
            }
        },
    }
});

// Template Preview Component
const TemplatePreview = ({ template, onClick }) => {
    return (
        <Card onClick={onClick} sx={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.02)', boxShadow: 3 } }}>
            <CardMedia
                component="img"
                height="194"
                image={template.imgSrc || 'https://placehold.co/400x400/E6E6E6/CCC?text=No+Image'} // Dùng imgSrc trực tiếp
                alt={template.title}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" component="div">{template.title} ({template.templateData?.width}x{template.templateData?.height})</Typography>
            </CardContent>
        </Card>
    );
};


// Template Picker Component
const TemplatePicker = ({ templates, onSelectTemplate }) => (
    <Box sx={{ mt: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ px: 1 }}>Chọn mẫu thiệp</Typography>
        <Grid container spacing={1.5} sx={{ px: 1 }}>
            {templates.length === 0 && (
                <Grid item xs={12} sx={{ textAlign: 'center', p: 2, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={24} />
                </Grid>
            )}
            {templates.map(template => (
                <Grid item key={template._id} xs={12}>
                    <TemplatePreview template={template} onClick={() => onSelectTemplate(template._id)} />
                </Grid>
            ))}
        </Grid>
    </Box>
);



// Generic Image Picker Component
const GenericImagePicker = ({ images, onSelectImage, title }) => (
    <Box sx={{ mt: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ px: 1 }}>{title}</Typography>
        <Grid container spacing={1.5} sx={{ px: 1 }}>
            {images.length === 0 ? (
                <Grid item xs={12} sx={{ textAlign: 'center', p: 2, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={24} />
                </Grid>
            ) : (
                images.map(image => (
                    <Grid item key={image.id} xs={6} sm={4}>
                        <Card onClick={() => onSelectImage(image.url)} sx={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.02)', boxShadow: 3 } }}>
                            <CardMedia component="img" height="80" image={image.url} alt={image.name} sx={{ objectFit: 'contain', p: 0.5 }}
                                onError={(e) => {
                                    const target = e.target; target.onerror = null;
                                    target.src = `https://placehold.co/80x80/E0E0E0/FFFFFF?text=Lỗi`;
                                }} />
                            <CardContent sx={{ p: 0.5, textAlign: 'center' }}><Typography variant="caption" noWrap component="div">{image.name}</Typography></CardContent>
                        </Card>
                    </Grid>
                ))
            )}
        </Grid>
    </Box>
);

// User Uploaded Image Picker Component
const UserImageManager = ({ userImages, onSelectUserImage, onImageUploaded }) => {
    const fileInputRef = useRef(null);
    const handleUploadButtonClick = () => fileInputRef.current?.click();
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) onImageUploaded(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <Box sx={{ px: 1 }}>
            <Typography variant="h6" gutterBottom>Ảnh của bạn</Typography>
            <Button variant="contained" onClick={handleUploadButtonClick} startIcon={<CloudUploadIcon />} sx={{ mb: 2, width: '100%' }} size="medium">Tải ảnh lên</Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
            {userImages.length === 0 && (
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>Bạn chưa tải ảnh nào lên.</Typography>
            )}
            <Grid container spacing={1} sx={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
                {userImages.map((img) => (
                    <Grid item key={img.id} xs={6} sm={4}>
                        <Card onClick={() => onSelectUserImage(img.url)} sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3, transform: 'scale(1.03)' }, transition: 'transform 0.1s, box-shadow 0.1s' }}>
                            <CardMedia component="img" height="80" image={img.url} alt={img.name} sx={{ objectFit: 'contain', p: 0.5 }}
                                onError={(e) => {
                                    const target = e.target; target.onerror = null;
                                    target.src = `https://placehold.co/80x80/EAEAEA/999999?text=Lỗi`;
                                }} />
                            <CardContent sx={{ p: 0.5, textAlign: 'center' }}><Typography variant="caption" noWrap display="block">{img.name}</Typography></CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};


// --- FIXED Draggable Item Component ---
const DraggableItemComponent = React.memo(({ item, onUpdateItem, canvasWidth, canvasHeight, isSelected, onSelectItem, zoomLevel, snapToGrid, gridSize, allItems, onSetSnapLines, snapToObject, children, canvasRef }) => {
    const itemRef = useRef(null);
    const panStartPos = useRef({ x: 0, y: 0 });
    const isLocked = item.locked;
    const isTransformingRef = useRef(false); // Ref to prevent pan while transforming
    const latestTransform = useRef(null); // Ref to hold the latest state during transform

    const handlePanStart = (event) => {
        if (isLocked || isTransformingRef.current) {
            return;
        }
        onSelectItem(item.id);
        panStartPos.current = { x: item.x, y: item.y };
    };

    const handlePan = (event, info) => {
        if (isLocked || isTransformingRef.current) {
            return;
        }
        let newX = panStartPos.current.x + info.offset.x / zoomLevel;
        let newY = panStartPos.current.y + info.offset.y / zoomLevel;
        let guides = [];

        if (snapToObject) {
            const snapResult = calculateSnapping({ ...item, x: newX, y: newY }, allItems, zoomLevel);
            newX = snapResult.snappedX;
            newY = snapResult.snappedY;
            guides = snapResult.guides;
        }

        onSetSnapLines(guides);
        onUpdateItem(item.id, { x: newX, y: newY }, false);
    };

    const handlePanEnd = (event, info) => {
        if (isLocked || isTransformingRef.current) {
            return;
        }
        let finalX = panStartPos.current.x + info.offset.x / zoomLevel;
        let finalY = panStartPos.current.y + info.offset.y / zoomLevel;
        let didSnap = false;

        if (snapToObject) {
            const { snappedX, snappedY, guides } = calculateSnapping({ ...item, x: finalX, y: finalY }, allItems, zoomLevel);
            if (guides.length > 0) {
                finalX = snappedX;
                finalY = snappedY;
                didSnap = true;
            }
        }

        if (!didSnap && snapToGrid && gridSize > 0) {
            finalX = Math.round(finalX / gridSize) * gridSize;
            finalY = Math.round(finalY / gridSize) * gridSize;
        }

        onSetSnapLines([]);
        onUpdateItem(item.id, { x: finalX, y: finalY }, true);
    };

    const handleResizeStart = (e) => {
        e.stopPropagation();
        isTransformingRef.current = true;
        onSelectItem(item.id);

        const startItem = { ...item };
        const angle = (startItem.rotation || 0) * (Math.PI / 180);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const startX = e.clientX;
        const startY = e.clientY;

        const handleResizeMove = (moveEvent) => {
            const dx = (moveEvent.clientX - startX) / zoomLevel;
            const dy = (moveEvent.clientY - startY) / zoomLevel;

            const dWidth = dx * cos + dy * sin;
            const dHeight = -dx * sin + dy * cos;

            const newWidth = Math.max(MIN_ITEM_WIDTH, startItem.width + dWidth);
            const newHeight = Math.max(MIN_ITEM_HEIGHT, startItem.height + dHeight);

            const dw = newWidth - startItem.width;
            const dh = newHeight - startItem.height;

            const shiftX = (dw / 2 * cos) - (dh / 2 * sin);
            const shiftY = (dw / 2 * sin) + (dh / 2 * cos);

            const newProps = {
                width: newWidth,
                height: newHeight,
                x: startItem.x - shiftX,
                y: startItem.y - shiftY,
            };

            latestTransform.current = newProps;
            onUpdateItem(item.id, newProps, false);
        };

        const handleResizeEnd = () => {
            window.removeEventListener('pointermove', handleResizeMove);
            window.removeEventListener('pointerup', handleResizeEnd);
            if (latestTransform.current) {
                onUpdateItem(item.id, latestTransform.current, true);
            }
            latestTransform.current = null;
            setTimeout(() => { isTransformingRef.current = false; }, 0);
        };

        window.addEventListener('pointermove', handleResizeMove);
        window.addEventListener('pointerup', handleResizeEnd);
    };

    const handleRotateStart = (e) => {
        e.stopPropagation();
        isTransformingRef.current = true;
        onSelectItem(item.id);

        if (!itemRef.current || !canvasRef.current) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();

        const itemCenterX = canvasRect.left + (item.x + item.width / 2) * zoomLevel;
        const itemCenterY = canvasRect.top + (item.y + item.height / 2) * zoomLevel;

        const startAngle = Math.atan2(e.clientY - itemCenterY, e.clientX - itemCenterX);
        const initialRotation = item.rotation || 0;

        const handleRotateMove = (moveEvent) => {
            const currentAngle = Math.atan2(moveEvent.clientY - itemCenterY, moveEvent.clientX - itemCenterX);
            const angleDelta = currentAngle - startAngle;
            let newRotation = initialRotation + angleDelta * (180 / Math.PI);

            if (snapToGrid || snapToObject) {
                newRotation = Math.round(newRotation / ROTATION_SNAP_ANGLE) * ROTATION_SNAP_ANGLE;
            }
            const newProps = { rotation: newRotation };
            latestTransform.current = newProps;
            onUpdateItem(item.id, newProps, false);
        };

        const handleRotateEnd = () => {
            window.removeEventListener('pointermove', handleRotateMove);
            window.removeEventListener('pointerup', handleRotateEnd);
            if (latestTransform.current) {
                onUpdateItem(item.id, latestTransform.current, true);
            }
            latestTransform.current = null;
            setTimeout(() => { isTransformingRef.current = false; }, 0);
        };

        window.addEventListener('pointermove', handleRotateMove);
        window.addEventListener('pointerup', handleRotateEnd);
    };


    return (
        <DraggableItem
            ref={itemRef}
            onPointerDown={() => onSelectItem(item.id)} // Select on any pointer down
            onPanStart={handlePanStart}
            onPan={handlePan}
            onPanEnd={handlePanEnd}
            style={{
                x: item.x,
                y: item.y,
                rotate: item.rotation || 0,
                zIndex: isSelected ? item.zIndex + 1000 : item.zIndex,
                width: item.width,
                height: item.height,
                border: isSelected ? `2px dashed #000000` : `2px solid transparent`,
                transformOrigin: 'center center',
                opacity: item.opacity,
                cursor: isLocked ? 'not-allowed' : 'grab',
            }}
        >
            {children}
            {isSelected && !isLocked && (
                <>
                    <div
                        style={{ ...ResizeHandleStyle, bottom: `-${HANDLE_OFFSET}px`, right: `-${HANDLE_OFFSET}px` }}
                        onPointerDown={handleResizeStart}
                    />
                    <div
                        style={{ ...RotateHandleStyle }}
                        onPointerDown={handleRotateStart}
                    />
                </>
            )}
        </DraggableItem>
    );
});


// Text Editor Component
const TextEditor = (props) => {
    const { item, onUpdateItem, onSelectItem } = props;
    const inputRef = useRef(null);
    const isLocked = item.locked;
    const measurementRef = useRef(null);


    const handleBlur = () => onUpdateItem(item.id, { isEditing: false }, true);
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleBlur();
        }
    };
    useLayoutEffect(() => {
        // Chỉ tính toán khi không trong chế độ chỉnh sửa hoặc khi nội dung thay đổi
        if (!item.isEditing && measurementRef.current) {
            const currentHeight = measurementRef.current.offsetHeight;
            // Kiểm tra nếu chiều cao thay đổi đáng kể, thì cập nhật item.height
            // Tránh vòng lặp vô hạn nếu có sự khác biệt nhỏ do làm tròn
            if (Math.abs(currentHeight - item.height) > 1) { // Sử dụng ngưỡng nhỏ, ví dụ 1px
                onUpdateItem(item.id, { height: currentHeight }, false); // Không ghi vào lịch sử ở đây
            }
        }
    }, [item.content, item.fontSize, item.fontFamily, item.width, item.isEditing, item.height, item.id, onUpdateItem]); // Thêm item.height vào dependency array


    return (
        <DraggableItemComponent {...props}>
            {!item.isEditing && (
                <div
                    ref={measurementRef}
                    style={{
                        position: 'absolute',
                        visibility: 'hidden', 
                        pointerEvents: 'none',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflow: 'hidden',
                        fontSize: `${item.fontSize}px`,
                        fontFamily: item.fontFamily,
                        lineHeight: 1.3,
                        width: `${item.width}px`, 
                        boxSizing: 'border-box',
                        padding: '5px', 
                    }}
                >
                    {item.content || "Văn bản"}
                </div>
            )}
            {item.isEditing && !isLocked ? (
                <TextField
                    inputRef={inputRef}
                    value={item.content}
                    onChange={(e) => onUpdateItem(item.id, { content: e.target.value }, false)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                        minWidth: '50px',
                        height: 'auto',
                        '& .MuiInputBase-root': { height: '100%', alignItems: 'flex-start' },
                        '& .MuiInputBase-input': {
                            fontSize: `${item.fontSize}px`, fontFamily: item.fontFamily, color: item.color,
                            padding: '5px', lineHeight: 1.3, width: '100%', height: '100%', boxSizing: 'border-box',
                            minHeight: MIN_ITEM_HEIGHT, 
                        },
                        minWidth: '50px',
                    }}
                    size="small" variant="outlined" autoFocus multiline
                />
            ) : (
                <Typography
                    variant="body1"
                    sx={{
                        userSelect: 'none', cursor: 'inherit', width: '100%', height: '100%', padding: '5px',
                        fontSize: `${item.fontSize}px`, fontFamily: item.fontFamily, color: item.color,
                        height: 'auto', 
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.3,
                        maxHeight: item.height,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'
                        
                    }}
                    onDoubleClick={(e) => { if (!isLocked) { e.stopPropagation(); onUpdateItem(item.id, { isEditing: true }, true); } }}
                    onClick={(e) => { if (!item.isEditing) { e.stopPropagation(); onSelectItem(item.id); } }}
                >
                    {item.content || "Văn bản"}
                </Typography>
            )}
        </DraggableItemComponent>
    );
};

// Image Editor Component
const ImageEditor = (props) => {
    const { item, onSelectItem } = props;
    const filterString = `brightness(${item.brightness ?? 1}) contrast(${item.contrast ?? 1}) grayscale(${item.grayscale ?? 0})`;

    return (
        <DraggableItemComponent {...props}>
            {item.url ? (
                <img
                    draggable={false}
                    src={item.url}
                    alt="Design element"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', display: 'block', filter: filterString, userSelect: 'none' }}
                    onError={(e) => {
                        const target = e.target;
                        target.onerror = null;
                        target.src = `https://placehold.co/${item.width || 100}x${item.height || 100}/E0E0E0/FFFFFF?text=Lỗi+Tải`;
                    }}
                    onClick={(e) => { e.stopPropagation(); onSelectItem(item.id); }}
                />
            ) : (
                <Box
                    style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer', textAlign: 'center', padding: '10px', boxSizing: 'border-box' }}
                    onClick={(e) => { e.stopPropagation(); onSelectItem(item.id); }}
                >
                    Chọn ảnh
                </Box>
            )}
        </DraggableItemComponent>
    );
};


// Property Editor for Text Items
const TextPropertyEditor = ({ item, onUpdate }) => (
    <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <TextField label="Nội dung" value={item.content} onChange={(e) => onUpdate(item.id, { content: e.target.value }, false)} onBlur={() => onUpdate(item.id, {}, true)} fullWidth margin="none" size="small" variant="outlined" multiline rows={3} />
        <TextField label="Chiều rộng (px)" type="number" value={Math.round(item.width)} onChange={(e) => onUpdate(item.id, { width: parseInt(e.target.value, 10) || MIN_ITEM_WIDTH }, false)} onBlur={() => onUpdate(item.id, {}, true)} fullWidth margin="none" size="small" variant="outlined" InputProps={{ inputProps: { min: MIN_ITEM_WIDTH } }} />
        <TextField label="Chiều cao (px)" type="number" value={Math.round(item.height)} onChange={(e) => onUpdate(item.id, { height: parseInt(e.target.value, 10) || MIN_ITEM_HEIGHT }, false)} onBlur={() => onUpdate(item.id, {}, true)} fullWidth margin="none" size="small" variant="outlined" InputProps={{ inputProps: { min: MIN_ITEM_HEIGHT } }} />
        <FormControl fullWidth margin="none" size="small">
            <InputLabel id="font-family-label">Font</InputLabel>
            <Select labelId="font-family-label" value={item.fontFamily} label="Font" onChange={(e) => onUpdate(item.id, { fontFamily: e.target.value }, true)} >
                {FONT_FAMILIES.map(font => (<MenuItem key={font} value={font}>{font}</MenuItem>))}
            </Select>
        </FormControl>
        <TextField label="Cỡ chữ" type="number" value={item.fontSize} onChange={(e) => onUpdate(item.id, { fontSize: parseInt(e.target.value, 10) || 12 }, false)} onBlur={() => onUpdate(item.id, {}, true)} fullWidth margin="none" size="small" variant="outlined" InputProps={{ inputProps: { min: 8, max: 200 } }} />
        <TextField label="Màu chữ" type="color" value={item.color} onChange={(e) => onUpdate(item.id, { color: e.target.value }, true)} fullWidth margin="none" size="small" variant="outlined" sx={{ '& input[type=color]': { height: '30px', padding: '2px', boxSizing: 'border-box', cursor: 'pointer' } }} />
        <Typography gutterBottom variant="body2" sx={{ mt: 1 }}>Xoay (độ)</Typography>
        <Slider value={item.rotation || 0} onChange={(_e, newValue) => onUpdate(item.id, { rotation: newValue }, false)} onChangeCommitted={() => onUpdate(item.id, {}, true)} aria-labelledby="rotation-slider" valueLabelDisplay="auto" step={1} marks min={-180} max={180} size="small" />
        <TextField label="Xoay (số)" type="number" value={Math.round(item.rotation || 0)} onChange={(e) => onUpdate(item.id, { rotation: parseFloat(e.target.value) || 0 }, false)} onBlur={() => onUpdate(item.id, {}, true)} fullWidth margin="none" size="small" variant="outlined" InputProps={{ inputProps: { min: -360, max: 360, step: 1 } }} />
    </Box>
);

// --- Image Property Editor - UPDATED FOR PERFORMANCE ---
const ImagePropertyEditor = ({ item, onUpdate, onScaleToCanvas, canvasWidth, canvasHeight }) => {
    // Local state for smooth slider experience
    const [liveBrightness, setLiveBrightness] = useState(item.brightness ?? 1);
    const [liveContrast, setLiveContrast] = useState(item.contrast ?? 1);
    const [liveGrayscale, setLiveGrayscale] = useState(item.grayscale ?? 0);

    // Update live state when the selected item changes
    useEffect(() => {
        setLiveBrightness(item.brightness ?? 1);
        setLiveContrast(item.contrast ?? 1);
        setLiveGrayscale(item.grayscale ?? 0);
    }, [item.id, item.brightness, item.contrast, item.grayscale]);

    // Handlers that update the main state only on commit (mouse release)
    const handleBrightnessCommit = () => onUpdate(item.id, { brightness: liveBrightness }, true);
    const handleContrastCommit = () => onUpdate(item.id, { contrast: liveContrast }, true);
    const handleGrayscaleCommit = () => onUpdate(item.id, { grayscale: liveGrayscale }, true);

    return (
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField label="Chiều rộng (px)" type="number" value={Math.round(item.width)} onChange={(e) => onUpdate(item.id, { width: parseInt(e.target.value, 10) || MIN_ITEM_WIDTH }, false)} onBlur={() => onUpdate(item.id, {}, true)} fullWidth margin="none" size="small" variant="outlined" InputProps={{ inputProps: { min: MIN_ITEM_WIDTH } }} />
            <TextField label="Chiều cao (px)" type="number" value={Math.round(item.height)} onChange={(e) => onUpdate(item.id, { height: parseInt(e.target.value, 10) || MIN_ITEM_HEIGHT }, false)} onBlur={() => onUpdate(item.id, {}, true)} fullWidth margin="none" size="small" variant="outlined" InputProps={{ inputProps: { min: MIN_ITEM_HEIGHT } }} />
            <Typography gutterBottom variant="body2" sx={{ mt: 1 }}>Xoay (độ)</Typography>
            <Slider value={item.rotation || 0} onChange={(_e, newValue) => onUpdate(item.id, { rotation: newValue }, false)} onChangeCommitted={() => onUpdate(item.id, {}, true)} aria-labelledby="rotation-slider" valueLabelDisplay="auto" step={1} marks min={-180} max={180} size="small" />
            <TextField label="Xoay (số)" type="number" value={Math.round(item.rotation || 0)} onChange={(e) => onUpdate(item.id, { rotation: parseFloat(e.target.value) || 0 }, false)} onBlur={() => onUpdate(item.id, {}, true)} fullWidth margin="none" size="small" variant="outlined" InputProps={{ inputProps: { min: -360, max: 360, step: 1 } }} />

            <Divider sx={{ my: 1 }} />
            <Button
                variant="outlined"
                startIcon={<CropFreeIcon />}
                onClick={() => onScaleToCanvas(item.id)}
                disabled={!item.url || item.locked} 
                fullWidth
                size="small"
            >
                Scale ảnh vừa Canvas
            </Button>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" gutterBottom>Hiệu ứng</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Tooltip title="Độ sáng"><Brightness7Icon sx={{ color: 'action.active' }} /></Tooltip>
                <Slider value={liveBrightness} onChange={(_e, val) => { setLiveBrightness(val); onUpdate(item.id, { brightness: val }, false); }} onChangeCommitted={handleBrightnessCommit} min={0} max={2} step={0.05} size="small" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Tooltip title="Độ tương phản"><ContrastIcon sx={{ color: 'action.active' }} /></Tooltip>
                <Slider value={liveContrast} onChange={(_e, val) => { setLiveContrast(val); onUpdate(item.id, { contrast: val }, false); }} onChangeCommitted={handleContrastCommit} min={0} max={2} step={0.05} size="small" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Tooltip title="Trắng đen"><FilterBAndWIcon sx={{ color: 'action.active' }} /></Tooltip>
                <Slider value={liveGrayscale} onChange={(_e, val) => { setLiveGrayscale(val); onUpdate(item.id, { grayscale: val }, false); }} onChangeCommitted={handleGrayscaleCommit} min={0} max={1} step={0.05} size="small" />
            </Box>
        </Box>
    );
};

// Layers Panel Component
const LayersPanel = ({ items, selectedItemId, onSelectItem, onToggleVisibility, onToggleLock, onMoveLayerUp, onMoveLayerDown }) => {
    const theme = useTheme();

    return (
        <List dense>
            {[...items].reverse().map((item, index) => {
                const reversedIndex = index;
                const isFirstInList = reversedIndex === 0;
                const isLastInList = reversedIndex === items.length - 1;

                return (
                    <ListItem
                        key={item.id}
                        onClick={() => onSelectItem(item.id)}
                        sx={{
                            backgroundColor: selectedItemId === item.id ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                            border: `1px solid ${selectedItemId === item.id ? theme.palette.primary.main : 'transparent'}`,
                            borderRadius: 1, mb: 0.5,
                            cursor: 'pointer'
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 24, mr: 1 }}>
                            {item.type === 'text' ? <TextFieldsIcon fontSize="small" /> : <ImageIcon fontSize="small" />}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.type === 'text' ? item.content : 'Hình ảnh'}
                            primaryTypographyProps={{ noWrap: true, sx: { opacity: item.visible === false ? 0.5 : 1 } }}
                        />
                        <Box>
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onMoveLayerUp(item.id); }} disabled={isFirstInList}>
                                <ArrowUpwardIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onMoveLayerDown(item.id); }} disabled={isLastInList}>
                                <ArrowDownwardIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onToggleLock(item.id); }}>
                            {item.locked ? <LockIcon fontSize="small" color="action" /> : <LockOpenIcon fontSize="small" />}
                        </IconButton>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onToggleVisibility(item.id); }}>
                            {item.visible === false ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" color="action" />}
                        </IconButton>
                    </ListItem>
                )
            })}
        </List>
    );
};

// Helper function to process a template and generate unique IDs
const processTemplate = (templateData) => {
    if (!templateData || !templateData.pages) return [];
    return templateData.pages.map(page => ({
        ...page,
        id: uuidv4(),
        canvasWidth: templateData.width || page.canvasWidth,
        canvasHeight: templateData.height || page.canvasHeight,
        items: page.items.map(item => ({
            ...item,
            id: uuidv4(),
        }))
    }));
};


// Main Wedding Invitation Editor Component
const WeddingInvitationEditor = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const [backendTemplates, setBackendTemplates] = useState([]);

    const { templateId, invitationId } = useParams();

    // State for Design Assets
    const [iconImages, setIconImages] = useState([]);
    const [componentImages, setComponentImages] = useState([]);
    const [tagImages, setTagImages] = useState([]);

    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const pages = history[historyIndex] || [];
    const [currentPageId, setCurrentPageId] = useState(null);
    const [clipboard, setClipboard] = useState(null);
    const [loading, setLoading] = useState(true);// Manages overall page loading
    const [saving, setSaving] = useState(false); 
    const [error, setError] = useState(null);

    // Fetch design assets (icons, components, tags)
    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const [iconsRes, componentsRes, tagsRes] = await Promise.all([
                    api.get('/design-assets?type=icon'),
                    api.get('/design-assets?type=component'),
                    api.get('/design-assets?type=tag')
                ]);

                // Map data to the format expected by GenericImagePicker ({ id, name, url })
                const mapData = (item) => ({ id: item._id, name: item.name, url: item.imgSrc });

                setIconImages(iconsRes.data.data.map(mapData));
                setComponentImages(componentsRes.data.data.map(mapData));
                setTagImages(tagsRes.data.data.map(mapData));

            } catch (err) {
                console.error("Lỗi khi tải tài nguyên thiết kế:", err);
            }
        };

        fetchAssets();
    }, []);


    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await api.get('/invitation-templates');
                setBackendTemplates(response.data.data || []);
            } catch (err) {
                console.error("Lỗi khi tải danh sách mẫu thiệp:", err);
            }
        };
        fetchTemplates();
    }, []);

// --- CORE DATA LOADING LOGIC (NEW/EDIT) ---
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (invitationId) {
                    // EDIT MODE: Fetch existing invitation data
                    const { data } = await api.get(`/invitations/${invitationId}`);
                    const invitationData = data.data; // Assuming data is nested under 'data' property
                    if (!invitationData || !invitationData.content || invitationData.content.length === 0) {
                        throw new Error("Dữ liệu thiệp mời không hợp lệ hoặc không tìm thấy.");
                    }
                    setHistory([invitationData.content]);
                    setHistoryIndex(0);
                    setCurrentPageId(invitationData.content[0]?.id || null);
                    setDesign(invitationData.design || { themeColor: '#ffffff', fontFamily: 'Arial' });
                    setSlug(invitationData.slug || '');

                } else if (templateId) {
                    // CREATE MODE: Fetch template data to start a new invitation
                    const { data } = await api.get(`/invitation-templates/${templateId}`);
                    const template = data.data;
                    if (!template || !template.templateData || !template.templateData.pages) {
                        throw new Error("Dữ liệu mẫu không hợp lệ.");
                    }
                    const processedPages = processTemplate(template.templateData);
                    setHistory([processedPages]);
                    setHistoryIndex(0);
                    setCurrentPageId(processedPages[0]?.id || null);
                    setDesign(template.templateData.design || { themeColor: '#ffffff', fontFamily: 'Arial' });
                    // Suggest a unique slug
                    const suggestedSlug = template.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-5);
                    setSlug(suggestedSlug);
                } else {
                    // No ID, redirect or show template picker
                    if (backendTemplates.length > 0) {
                        const initialTemplate = backendTemplates[0];
                        if (initialTemplate) {
                            navigate(`/canvas/template/${initialTemplate._id}`, { replace: true });
                        }
                    }
                }
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
                setError(err.response?.data?.message || "Không thể tải dữ liệu. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        // Only run loadData if we have IDs or the template list is ready
        if (invitationId || templateId) {
            loadData();
        } else if (backendTemplates.length > 0) {
            loadData();
        }
    }, [invitationId, templateId, backendTemplates, navigate]);


    const [slug, setSlug] = useState('');
    const [design, setDesign] = useState({ themeColor: '#ffffff', fontFamily: 'Arial' }); // State for design

    const exportCanvasRef = useRef(null);
    const canvasContainerRef = useRef(null);
    const canvasWrapperRef = useRef(null);
    const loadProjectInputRef = useRef(null);

    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [headerMenuAnchorEl, setHeaderMenuAnchorEl] = React.useState(null);
    const [downloadMenuAnchorEl, setDownloadMenuAnchorEl] = useState(null); // <--- THÊM STATE MỚI

    const handleDownloadMenuOpen = (event) => {
        setDownloadMenuAnchorEl(event.currentTarget);
    };

    const handleDownloadMenuClose = () => {
        setDownloadMenuAnchorEl(null);
    };

    const [openTemplatePicker, setOpenTemplatePicker] = useState(false);
    const [openIconPickerDrawer, setOpenIconPickerDrawer] = useState(false);
    const [openUserImageManagerDrawer, setOpenUserImageManagerDrawer] = useState(false);
    const [userUploadedImages, setUserUploadedImages] = useState([]);
    const [openPatternPickerDrawer, setOpenPatternPickerDrawer] = useState(false);
    const [openBorderPickerDrawer, setOpenBorderPickerDrawer] = useState(false);

    const [showGuidelines, setShowGuidelines] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
    const isPanning = useRef(false);
    const panStart = useRef({ x: 0, y: 0 });

    const [showGrid, setShowGrid] = useState(false);
    const [snapToGrid, setSnapToGrid] = useState(true);
    const [gridSize, setGridSize] = useState(20);
    const [snapToObject, setSnapToObject] = useState(true);
    const [snapLines, setSnapLines] = useState([]);


    const setPages = (newPages, recordHistory = true) => {
        if (recordHistory) {
            const newHistory = history.slice(0, historyIndex + 1);
            setHistory([...newHistory, newPages]);
            setHistoryIndex(newHistory.length);
        } else {
            const newHistory = [...history];
            newHistory[historyIndex] = newPages;
            setHistory(newHistory);
        }
    };

    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex(prevIndex => prevIndex - 1);
            setSelectedItemId(null);
        }
    }, [historyIndex]);

    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(prevIndex => prevIndex + 1);
            setSelectedItemId(null);
        }
    }, [history, historyIndex]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (invitationId) {
                    const { data } = await api.get(`/invitations/${invitationId}`);
                    if (!data || !data.content || data.content.length === 0) {
                        throw new Error("Dữ liệu thiệp mời không hợp lệ hoặc không tìm thấy.");
                    }
                    setHistory([data.content]);
                    setHistoryIndex(0);
                    setCurrentPageId(data.content[0]?.id || null);
                    setDesign(data.design || { themeColor: '#ffffff', fontFamily: 'Arial' });
                    setSlug(data.slug || '');

                } else if (templateId) {
                    const { data } = await api.get(`/invitation-templates/${templateId}`);
                    const template = data.data;
                    if (!template || !template.templateData || !template.templateData.pages) {
                        throw new Error("Dữ liệu mẫu không hợp lệ.");
                    }
                    const processedPages = processTemplate(template.templateData);
                    setHistory([processedPages]);
                    setHistoryIndex(0);
                    setCurrentPageId(processedPages[0]?.id || null);
                    setDesign(template.templateData.design || { themeColor: '#ffffff', fontFamily: 'Arial' });
                    const suggestedSlug = template.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-5);
                    setSlug(suggestedSlug);
                } else {
                    if (backendTemplates.length > 0) {
                        const initialTemplate = backendTemplates[0];
                        if (initialTemplate) {
                            navigate(`/canvas/template/${initialTemplate._id}`, { replace: true });
                        }
                    }
                }
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
                setError(err.response?.data?.message || "Không thể tải dữ liệu. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }

        };

        if (invitationId || templateId) {
            loadData();
        } else if (backendTemplates.length > 0) {
            loadData();
        }
    }, [invitationId, templateId, backendTemplates, navigate]);



    // const handleSaveChanges = async () => {
    //     if (!pages || pages.length === 0) {
    //     alert("Không có nội dung để lưu.");
    //     return;
    //     }
    //     if (!slug.trim()) {
    //         alert("Vui lòng nhập đường dẫn (slug) cho thiệp của bạn.");
    //         return;
    //     }

    //     // Làm sạch sâu dữ liệu `pages` trước khi gửi đi
    //     const pagesForBackend = pages.map(page => {
    //         // 1. Loại bỏ trường 'id' khỏi đối tượng trang
    //         const { id: pageIdToExclude, items, ...restOfPage } = page;

    //         // 2. Lặp và làm sạch từng đối tượng 'item' bên trong
    //         const cleanedItems = items.map(item => {
    //             const { id: itemIdToExclude, isEditing, ...restOfItem } = item;
    //             return restOfItem;
    //         });

    //         // 3. Trả về đối tượng trang hoàn chỉnh
    //         return {
    //             ...restOfPage,
    //             items: cleanedItems
    //         };
    //     });

    //     const invitationData = {
    //         content: pagesForBackend,
    //         design: design,
    //         slug: slug.trim(),
    //     };

    //     setSaving(true);
    //     try {
    //         if (invitationId) {
    //             // Cập nhật thiệp đã có
    //             const response = await api.put(`/invitations/${invitationId}`, invitationData);
    //             alert('Cập nhật thiệp thành công!');
    //         } else {
    //             // Tạo thiệp mới
    //             const createData = { ...invitationData, templateId: templateId };
    //             const response = await api.post('/invitations', createData);
    //             alert('Tạo thiệp mới thành công!');
    //             navigate(`/canvas/edit/${response.data._id}`, { replace: true });
    //         }
    //     } catch (error) {
    //         console.error("Lỗi khi lưu thiệp:", error);
    //         const serverError = error.response?.data?.message || 'Đã có lỗi xảy ra.';
    //         alert(`Lưu thất bại: ${serverError}`);
    //     } finally {
    //         setSaving(false);
    //     }
    // };
    const handleSaveChanges = async () => {
        // 1. Kiểm tra các điều kiện cơ bản
        if (!pages || pages.length === 0) {
            alert("Không có nội dung để lưu.");
            return;
        }
        if (!slug.trim()) {
            alert("Vui lòng nhập đường dẫn (slug) cho thiệp của bạn.");
            return;
        }

        // 2. Chỉ làm sạch các trường không thuộc schema (như isEditing)
        // Giữ lại tất cả các trường khác, BAO GỒM CẢ 'id'
        const pagesForBackend = pages.map(page => {
            const cleanedItems = page.items.map(item => {
                const { isEditing, ...restOfItem } = item; // Chỉ loại bỏ isEditing
                return restOfItem;
            });
            return { ...page, items: cleanedItems };
        });

        // 3. Chuẩn bị dữ liệu cuối cùng
        const invitationData = {
            content: pagesForBackend,
            design: design,
            slug: slug.trim(),
        };

        // 4. Bắt đầu quá trình lưu
        setSaving(true);
        try {
            if (invitationId) {
                // Cập nhật thiệp
                const response = await api.put(`/invitations/${invitationId}`, invitationData);
                alert('Cập nhật thiệp thành công!');
            } else {
                // Tạo thiệp mới
                const createData = { ...invitationData, templateId: templateId };
                const response = await api.post('/invitations', createData);
                alert('Tạo thiệp mới thành công!');
                navigate(`/canvas/edit/${response.data._id}`, { replace: true });
            }
        } catch (error) {
            console.error("Lỗi khi lưu thiệp:", error.response?.data || error);
            // Kiểm tra lỗi xác thực trước tiên
            if (error.response?.status === 401 || error.response?.data?.message?.includes("authorized")) {
                alert('Lưu thất bại: Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                window.location.href = '/sign-in'; // Điều hướng về trang đăng nhập
            } else {
                // Hiển thị các lỗi validation khác
                const serverError = error.response?.data?.message || 'Đã có lỗi xảy ra.';
                alert(`Lưu thất bại: ${serverError}`);
            }
        } finally {
            setSaving(false);
        }
    };



    const currentPage = pages.find(p => p.id === currentPageId);
    const currentItems = currentPage ? currentPage.items : [];
    const currentBackgroundImage = currentPage ? currentPage.backgroundImage : null;
    const currentCanvasWidth = currentPage ? currentPage.canvasWidth : DEFAULT_CANVAS_WIDTH;
    const currentCanvasHeight = currentPage ? currentPage.canvasHeight : DEFAULT_CANVAS_HEIGHT;

    const handleOpenTemplatePicker = () => { setOpenTemplatePicker(true); if (isMobile) setLeftSidebarOpen(false); }
    const handleCloseTemplatePicker = () => setOpenTemplatePicker(false);
    const handleOpenIconPickerDrawer = () => { setOpenIconPickerDrawer(true); if (isMobile) setLeftSidebarOpen(false); }
    const handleCloseIconPickerDrawer = () => setOpenIconPickerDrawer(false);
    const handleOpenUserImageManagerDrawer = () => { setOpenUserImageManagerDrawer(true); if (isMobile) setLeftSidebarOpen(false); }
    const handleCloseUserImageManagerDrawer = () => setOpenUserImageManagerDrawer(false);
    const handleOpenPatternPickerDrawer = () => { setOpenPatternPickerDrawer(true); if (isMobile) setLeftSidebarOpen(false); }
    const handleClosePatternPickerDrawer = () => setOpenPatternPickerDrawer(false);
    const handleOpenBorderPickerDrawer = () => { setOpenBorderPickerDrawer(true); if (isMobile) setLeftSidebarOpen(false); }
    const handleCloseBorderPickerDrawer = () => setOpenBorderPickerDrawer(false);

    const handleZoomIn = () => setZoomLevel(prevZoom => Math.min(MAX_ZOOM, prevZoom + ZOOM_STEP));
    const handleZoomOut = () => setZoomLevel(prevZoom => Math.max(MIN_ZOOM, prevZoom - ZOOM_STEP));
    const handleZoomSliderChange = (_event, newValue) => setZoomLevel(newValue);

    const handleSelectItem = useCallback((id) => {
        const item = currentItems.find(i => i.id === id);
        if (item?.locked) return;

        setSelectedItemId(id);
        if (id !== null && currentPageId) {
            const newPages = pages.map(page => {
                if (page.id === currentPageId) {
                    return {
                        ...page,
                        items: page.items.map(item =>
                            (item.type === 'text' && item.id !== id && item.isEditing) ? { ...item, isEditing: false } : item
                        )
                    };
                }
                return page;
            });
            setPages(newPages, false);
        }
    }, [currentPageId, pages, currentItems]);

    const handleCanvasWrapperMouseDown = (event) => {
        const targetElement = event.target;

        if (('button' in event && event.button === 0) || !('button' in event)) {
            if ((targetElement === canvasContainerRef.current || targetElement === event.currentTarget || targetElement === canvasWrapperRef.current) && !targetElement.closest('.handle')) {
                handleSelectItem(null);
                if (currentPageId) {
                    const newPages = pages.map(page => {
                        if (page.id === currentPageId) {
                            return {
                                ...page,
                                items: page.items.map(item =>
                                    item.type === 'text' && item.isEditing ? { ...item, isEditing: false } : item
                                )
                            };
                        }
                        return page;
                    });
                    setPages(newPages, true);
                }
            }
        }

        const isPanTrigger = ('button' in event && event.button === 1) || ('button' in event && event.button === 0 && event.ctrlKey) || ('touches' in event && event.touches.length === 2);

        if (isPanTrigger) {
            event.preventDefault();
            isPanning.current = true;
            const currentX = 'touches' in event ? event.touches[0].clientX : event.clientX;
            const currentY = 'touches' in event ? event.touches[0].clientY : event.clientY;
            panStart.current = { x: currentX, y: currentY };
            if (canvasWrapperRef.current) canvasWrapperRef.current.style.cursor = 'grabbing';

            const handleGlobalMouseMove = (e) => {
                if (!isPanning.current) return;
                const moveX = 'touches' in e ? e.touches[0].clientX : e.clientX;
                const moveY = 'touches' in e ? e.touches[0].clientY : e.clientY;
                const dx = moveX - panStart.current.x;
                const dy = moveY - panStart.current.y;
                setViewOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
                panStart.current = { x: moveX, y: moveY };
            };

            const handleGlobalMouseUp = () => {
                if (isPanning.current) {
                    isPanning.current = false;
                    if (canvasWrapperRef.current) canvasWrapperRef.current.style.cursor = 'grab';
                    window.removeEventListener('mousemove', handleGlobalMouseMove);
                    window.removeEventListener('mouseup', handleGlobalMouseUp);
                    window.removeEventListener('touchmove', handleGlobalMouseMove);
                    window.removeEventListener('touchend', handleGlobalMouseUp);
                }
            };
            window.addEventListener('mousemove', handleGlobalMouseMove);
            window.addEventListener('mouseup', handleGlobalMouseUp);
            window.addEventListener('touchmove', handleGlobalMouseMove);
            window.addEventListener('touchend', handleGlobalMouseUp);
        }
    };

    const wrapText = (context, text, maxWidth) => {
        const paragraphs = text.split('\n');
        const allLines = [];

        paragraphs.forEach(paragraph => {
            if (paragraph === '') {
                allLines.push(''); // Giữ lại các dòng trống
                return;
            }

            const words = paragraph.split(' ');
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const testLine = currentLine + ' ' + word;
                const metrics = context.measureText(testLine);
                const testWidth = metrics.width;

                if (testWidth > maxWidth && i > 0) {
                    allLines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            allLines.push(currentLine);
        });

        return allLines;
    };


    const handleCanvasWrapperContextMenu = (event) => event.preventDefault();

    const getNextZIndex = useCallback(() => {
        if (!currentPage || currentItems.length === 0) return BASE_Z_INDEX;
        return Math.max(...currentItems.map(item => item.zIndex), BASE_Z_INDEX - 1) + 1;
    }, [currentItems, currentPage]);

    const handleSelectTemplate = useCallback((selectedTemplateId) => {
        if (!selectedTemplateId) return;
        setOpenTemplatePicker(false);
        navigate(`/canvas/template/${selectedTemplateId}`);
    }, [navigate]);

    const handleAddPage = () => {
        const newPageId = uuidv4();
        const newPageNumber = pages.length + 1;

        const newPage = {
            id: newPageId,
            name: `Trang ${newPageNumber}`,
            items: [],
            backgroundImage: currentPage?.backgroundImage || 'https://placehold.co/800x600/FFFFFF/333333?text=Trang+Mới',
            canvasWidth: currentPage?.canvasWidth || DEFAULT_CANVAS_WIDTH,
            canvasHeight: currentPage?.canvasHeight || DEFAULT_CANVAS_HEIGHT,
        };
        setPages([...pages, newPage], true);
        setCurrentPageId(newPageId);
        setSelectedItemId(null);
        setZoomLevel(1);
        setViewOffset({ x: 0, y: 0 });
    };

    // This effect ensures currentPageId is always valid.
    useEffect(() => {
        if (pages.length > 0 && !pages.find(p => p.id === currentPageId)) {
            setCurrentPageId(pages[0]?.id || null);
        }
    }, [currentPageId, pages]);


    const handleAddText = () => {
        if (!currentPage) return;
        const newZIndex = getNextZIndex();
        const newTextItem = {
            ...defaultItemProps,
            id: uuidv4(), content: 'Nội dung mới',
            x: currentPage.canvasWidth / 2 - 125, y: currentPage.canvasHeight / 2 - 25,
            width: 250, height: 50,
            fontFamily: 'Arial', fontSize: 24, color: '#333333', isEditing: true,
            type: 'text', zIndex: newZIndex,
        };
        const newPages = pages.map(page =>
            page.id === currentPageId ? { ...page, items: [...page.items, newTextItem] } : page
        );
        setPages(newPages, true);
        setSelectedItemId(newTextItem.id);
        if (isMobile) setLeftSidebarOpen(false);
    };


    const addImageToCanvas = useCallback((imageUrl) => {
        // Luôn tìm `currentPage` bên trong callback để đảm bảo nó luôn mới nhất.
        const currentPage = pages.find(p => p.id === currentPageId);

        if (!currentPage) {
            console.warn("Thao tác bị hủy: Không có trang nào được chọn để thêm ảnh.");
            alert("Vui lòng chọn một trang trước khi thêm đối tượng.");
            return;
        }

        const newZIndex = getNextZIndex();
        const img = new Image();
        img.crossOrigin = "anonymous"; // Cần thiết để thao tác với ảnh từ nguồn khác trên canvas

        img.onload = () => {
            const aspectRatio = img.width / img.height;
            let newWidth = Math.min(img.width, currentPage.canvasWidth * 0.25);
            let newHeight = newWidth / aspectRatio;

            if (newHeight > currentPage.canvasHeight * 0.25) {
                newHeight = currentPage.canvasHeight * 0.25;
                newWidth = newHeight * aspectRatio;
            }

            const newImageItem = {
                ...defaultItemProps,
                id: uuidv4(),
                url: imageUrl,
                x: currentPage.canvasWidth / 2 - newWidth / 2,
                y: currentPage.canvasHeight / 2 - newHeight / 2,
                width: newWidth,
                height: newHeight,
                type: 'image',
                zIndex: newZIndex,
            };

            const newPages = pages.map(page =>
                page.id === currentPageId ? { ...page, items: [...page.items, newImageItem] } : page
            );

            setPages(newPages, true);
            setSelectedItemId(newImageItem.id);
        };

        img.onerror = (e) => {
            console.error("Lỗi khi tải ảnh để thêm vào canvas:", imageUrl, e);
            alert(`Không thể tải được hình ảnh từ đường dẫn: ${imageUrl}`);
        };

        img.src = imageUrl;
    }, [pages, currentPageId, getNextZIndex]); 

    const handleAddIconFromPicker = (imageUrl) => { addImageToCanvas(imageUrl); handleCloseIconPickerDrawer(); };
    const handleAddUserImageToCanvas = (imageUrl) => { addImageToCanvas(imageUrl); handleCloseUserImageManagerDrawer(); };
    const handleAddPatternImageFromPicker = (imageUrl) => { addImageToCanvas(imageUrl); handleClosePatternPickerDrawer(); };
    const handleAddBorderImageFromPicker = (imageUrl) => { addImageToCanvas(imageUrl); handleCloseBorderPickerDrawer(); };

    const handleUserImageFileUpload = useCallback((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target?.result;
            if (imageUrl) {
                const newUserImage = { id: uuidv4(), name: file.name, url: imageUrl };
                setUserUploadedImages(prev => [newUserImage, ...prev]);
            }
        };
        reader.onerror = (e) => console.error("File reading error:", e);
        reader.readAsDataURL(file);
    }, []);

    const handleUpdateItem = useCallback((itemId, updates, recordHistory) => {
        if (!currentPageId) return;
        const newPages = pages.map(page => {
            if (page.id === currentPageId) {
                return {
                    ...page,
                    items: page.items.map(item => item.id === itemId ? { ...item, ...updates } : item)
                };
            }
            return page;
        });
        setPages(newPages, recordHistory);
    }, [currentPageId, pages]);

    const handleDeleteItem = useCallback((itemId) => {
        if (!currentPageId || !itemId) return;
        const newPages = pages.map(page => {
            if (page.id === currentPageId) {
                return { ...page, items: page.items.filter(item => item.id !== itemId) };
            }
            return page;
        });
        setPages(newPages, true);
        if (selectedItemId === itemId) setSelectedItemId(null);
    }, [currentPageId, selectedItemId, pages]);

    const handleBringToFront = useCallback((itemId) => {
        if (!currentPageId || !itemId) return;
        const newPages = pages.map(p => {
            if (p.id === currentPageId) {
                const itemToMove = p.items.find(item => item.id === itemId);
                if (!itemToMove) return p;
                const maxZIndex = p.items.length > 0 ? Math.max(...p.items.filter(i => i.id !== itemId).map(i => i.zIndex), BASE_Z_INDEX - 1) : BASE_Z_INDEX - 1;
                const updatedItem = { ...itemToMove, zIndex: maxZIndex + 1 };
                return { ...p, items: p.items.filter(i => i.id !== itemId).concat(updatedItem).sort((a, b) => a.zIndex - b.zIndex) };
            }
            return p;
        });
        setPages(newPages, true);
    }, [currentPageId, pages]);

    const handleSendToBack = useCallback((itemId) => {
        if (!currentPageId || !itemId) return;
        const newPages = pages.map(p => {
            if (p.id === currentPageId) {
                const itemToMove = p.items.find(item => item.id === itemId);
                if (!itemToMove) return p;
                const minZIndex = p.items.length > 0 ? Math.min(...p.items.filter(i => i.id !== itemId).map(i => i.zIndex), BASE_Z_INDEX + 1) : BASE_Z_INDEX + 1;
                const updatedItem = { ...itemToMove, zIndex: Math.max(BASE_Z_INDEX, minZIndex - 1) };
                return { ...p, items: [updatedItem, ...p.items.filter(i => i.id !== itemId)].sort((a, b) => a.zIndex - b.zIndex) };
            }
            return p;
        });
        setPages(newPages, true);
    }, [currentPageId, pages]);

    const handleCopy = useCallback(() => {
        if (!selectedItemId || !currentPage) return;
        const itemToCopy = currentPage.items.find(item => item.id === selectedItemId);
        if (itemToCopy) {
            setClipboard(itemToCopy);
        }
    }, [selectedItemId, currentPage]);

    const handlePaste = useCallback(() => {
        if (!clipboard || !currentPage) return;
        const newZIndex = getNextZIndex();
        const newItem = {
            ...clipboard,
            id: uuidv4(),
            x: clipboard.x + 20,
            y: clipboard.y + 20,
            zIndex: newZIndex,
            isEditing: false,
            locked: false,
        };
        const newPages = pages.map(page =>
            page.id === currentPageId ? { ...page, items: [...page.items, newItem] } : page
        );
        setPages(newPages, true);
        setSelectedItemId(newItem.id);
    }, [clipboard, currentPage, currentPageId, getNextZIndex, pages]);

    const moveLayer = useCallback((itemId, direction) => {
        if (!currentPage) return;
        let items = [...currentPage.items];
        const currentIndex = items.findIndex(item => item.id === itemId);
        if (currentIndex === -1) return;

        const newIndex = currentIndex + direction;
        if (newIndex < 0 || newIndex >= items.length) return;

        [items[currentIndex], items[newIndex]] = [items[newIndex], items[currentIndex]];

        const reorderedItems = items.map((item, index) => ({
            ...item,
            zIndex: BASE_Z_INDEX + index
        }));

        const newPages = pages.map(p =>
            p.id === currentPageId ? { ...p, items: reorderedItems } : p
        );
        setPages(newPages, true);
    }, [pages, currentPageId, currentPage]);


    const handleMoveLayerUp = useCallback((itemId) => moveLayer(itemId, 1), [moveLayer]);
    const handleMoveLayerDown = useCallback((itemId) => moveLayer(itemId, -1), [moveLayer]);


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') { return; }
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); handleUndo(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); handleRedo(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') { e.preventDefault(); handleCopy(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'v') { e.preventDefault(); handlePaste(); }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                if (selectedItemId) handleDeleteItem(selectedItemId);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === ']') {
                e.preventDefault();
                if (selectedItemId) handleBringToFront(selectedItemId);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === '[') {
                e.preventDefault();
                if (selectedItemId) handleSendToBack(selectedItemId);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => { window.removeEventListener('keydown', handleKeyDown); };
    }, [handleUndo, handleRedo, handleCopy, handlePaste, handleDeleteItem, handleBringToFront, handleSendToBack, selectedItemId]);


    useEffect(() => {
        const bgCanvas = document.getElementById('background-canvas');
        const bgCtx = bgCanvas?.getContext('2d');
        if (!bgCanvas || !bgCtx || !currentPage) return;

        bgCanvas.width = currentCanvasWidth;
        bgCanvas.height = currentCanvasHeight;

        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        if (currentBackgroundImage) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => { bgCtx.drawImage(img, 0, 0, bgCanvas.width, bgCanvas.height); };
            img.onerror = () => {
                bgCtx.fillStyle = '#e0e0e0';
                bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
            };
            img.src = currentBackgroundImage;
        } else {
            bgCtx.fillStyle = '#ffffff';
            bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
        }
    }, [currentBackgroundImage, currentCanvasWidth, currentCanvasHeight, currentPage?.id]);

    useEffect(() => {
        const gridCanvas = document.getElementById('grid-canvas');
        const gridCtx = gridCanvas?.getContext('2d');
        if (!gridCanvas || !gridCtx || !currentPage) return;

        gridCanvas.width = currentCanvasWidth;
        gridCanvas.height = currentCanvasHeight;
        gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

        if (showGrid && gridSize > 0) {
            gridCtx.beginPath();
            gridCtx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            gridCtx.lineWidth = Math.max(0.5, 0.5 / zoomLevel);
            for (let x = gridSize; x < currentCanvasWidth; x += gridSize) {
                gridCtx.moveTo(x, 0); gridCtx.lineTo(x, currentCanvasHeight);
            }
            for (let y = gridSize; y < currentCanvasHeight; y += gridSize) {
                gridCtx.moveTo(0, y); gridCtx.lineTo(currentCanvasWidth, y);
            }
            gridCtx.stroke();
        }

        if (showGuidelines) {
            gridCtx.beginPath();
            gridCtx.setLineDash([5, 5]);
            gridCtx.strokeStyle = 'rgba(0,0,0,0.3)';
            gridCtx.lineWidth = Math.max(0.5, 0.5 / zoomLevel);
            gridCtx.moveTo(0, currentCanvasHeight / 2); gridCtx.lineTo(currentCanvasWidth, currentCanvasHeight / 2);
            gridCtx.moveTo(currentCanvasWidth / 2, 0); gridCtx.lineTo(currentCanvasWidth / 2, currentCanvasHeight);
            gridCtx.stroke();
            gridCtx.setLineDash([]);
        }
    }, [showGrid, gridSize, showGuidelines, currentCanvasWidth, currentCanvasHeight, zoomLevel, currentPage?.id]);

    useEffect(() => {
        const snapCanvas = document.getElementById('snap-lines-canvas');
        const snapCtx = snapCanvas?.getContext('2d');
        if (!snapCanvas || !snapCtx || !currentPage) return;

        snapCanvas.width = currentCanvasWidth;
        snapCanvas.height = currentCanvasHeight;

        snapCtx.clearRect(0, 0, snapCanvas.width, snapCanvas.height);
        if (snapLines.length > 0) {
            snapCtx.strokeStyle = 'rgba(255, 0, 0, 0.9)';
            snapCtx.lineWidth = 1 / zoomLevel;
            snapCtx.beginPath();
            snapLines.forEach(line => {
                if (line.type === 'v') {
                    snapCtx.moveTo(line.x, 0);
                    snapCtx.lineTo(line.x, currentCanvasHeight);
                } else {
                    snapCtx.moveTo(0, line.y);
                    snapCtx.lineTo(currentCanvasWidth, line.y);
                }
            });
            snapCtx.stroke();
        }
    }, [snapLines, currentCanvasWidth, currentCanvasHeight, zoomLevel, currentPage?.id]);


    useEffect(() => { if (zoomLevel === 1) setViewOffset({ x: 0, y: 0 }); }, [zoomLevel]);
    useEffect(() => {
        const wrapper = canvasWrapperRef.current;
        if (wrapper) wrapper.style.cursor = isPanning.current ? 'grabbing' : 'grab';
    }, [isPanning.current]);

    const handleSaveProject = () => {
        if (pages.length === 0) { alert("Không có gì để lưu."); return; }
        const projectData = { pages: pages, };
        const jsonString = JSON.stringify(projectData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `DuAnThiepMoi_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    const handleLoadProjectClick = () => { loadProjectInputRef.current?.click(); };

    const handleLoadProjectFile = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result; const projectData = JSON.parse(text);
                if (projectData && Array.isArray(projectData.pages)) {
                    setHistory([projectData.pages]); setHistoryIndex(0);
                    setCurrentPageId(projectData.pages[0]?.id || null);
                    setSelectedItemId(null); setZoomLevel(1); setViewOffset({ x: 0, y: 0 });
                } else { alert("File dự án không hợp lệ."); }
            } catch (error) {
                console.error("Lỗi khi đọc file dự án:", error);
                alert("Không thể đọc file dự án. File có thể bị lỗi.");
            }
        };
        reader.readAsText(file);
        if (loadProjectInputRef.current) loadProjectInputRef.current.value = "";
    };

    const handleExportPdf = async () => {
        const exportCvs = exportCanvasRef.current;
        if (!exportCvs || pages.length === 0) {
            console.error('Canvas không khả dụng.');
            alert('Không có trang nào để xuất file PDF.');
            return;
        }

        const previouslySelectedItemId = selectedItemId;
        setSelectedItemId(null); // Bỏ chọn item để ẩn border khi xuất file
        await new Promise(resolve => setTimeout(resolve, 50));

        const exportCtx = exportCvs.getContext('2d');
        if (!exportCtx) {
            console.error('Không thể lấy context 2D.');
            if (previouslySelectedItemId) setSelectedItemId(previouslySelectedItemId);
            return;
        }

        // Khởi tạo PDF với kích thước của trang đầu tiên
        const firstPage = pages[0];
        const orientation = firstPage.canvasWidth > firstPage.canvasHeight ? 'l' : 'p';
        const pdf = new jsPDF({
            orientation: orientation,
            unit: 'px', // Sử dụng pixel để khớp với canvas
            format: [firstPage.canvasWidth, firstPage.canvasHeight]
        });

        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];

            // Nếu không phải trang đầu, thêm một trang mới vào PDF với kích thước tương ứng
            if (i > 0) {
                const pageOrientation = page.canvasWidth > page.canvasHeight ? 'l' : 'p';
                pdf.addPage([page.canvasWidth, page.canvasHeight], pageOrientation);
            }
            
            // --- Phần vẽ lên canvas (sao chép logic từ handleExportZip) ---
            exportCvs.width = page.canvasWidth;
            exportCvs.height = page.canvasHeight;
            exportCtx.fillStyle = '#FFFFFF';
            exportCtx.fillRect(0, 0, exportCvs.width, exportCvs.height);

            // Vẽ ảnh nền
            if (page.backgroundImage) {
                try {
                    const bgImage = new Image();
                    bgImage.crossOrigin = "anonymous";
                    await new Promise((resolve, reject) => {
                        bgImage.onload = () => {
                            exportCtx.drawImage(bgImage, 0, 0, page.canvasWidth, page.canvasHeight);
                            resolve();
                        };
                        bgImage.onerror = () => {
                            exportCtx.fillStyle = '#e0e0e0';
                            exportCtx.fillRect(0, 0, page.canvasWidth, page.canvasHeight);
                            resolve();
                        };
                        bgImage.src = page.backgroundImage;
                    });
                } catch (e) {
                    exportCtx.fillStyle = '#cccccc';
                    exportCtx.fillRect(0, 0, page.canvasWidth, page.canvasHeight);
                }
            }

            // Vẽ các item
            const sortedItems = [...page.items].sort((a, b) => a.zIndex - b.zIndex);
            for (const item of sortedItems) {
                if (item.visible === false) continue;
                exportCtx.save();
                exportCtx.globalAlpha = item.opacity;
                const itemCenterX = item.x + item.width / 2;
                const itemCenterY = item.y + item.height / 2;
                exportCtx.translate(itemCenterX, itemCenterY);
                exportCtx.rotate((item.rotation || 0) * Math.PI / 180);

                if (item.type === 'text') {
                    exportCtx.font = `${item.fontSize}px "${item.fontFamily}"`;
                    exportCtx.fillStyle = item.color;
                    exportCtx.textAlign = 'center'; 
                    exportCtx.textBaseline = 'middle';
                    const lines = wrapText(exportCtx, item.content, item.width);
                    const lineHeight = item.fontSize * 1.3;
                    const totalTextBlockHeight = lines.length * lineHeight;
                    const startY = -totalTextBlockHeight / 2 + lineHeight / 2;
                    lines.forEach((line, index) => {
                        exportCtx.fillText(line, 0, startY + index * lineHeight);
                    });
                } else if (item.type === 'image' && item.url) {
                    try {
                        const itemImg = new Image();
                        itemImg.crossOrigin = "anonymous";
                        await new Promise((resolve) => {
                            itemImg.onload = () => {
                                const filterString = `brightness(${item.brightness ?? 1}) contrast(${item.contrast ?? 1}) grayscale(${item.grayscale ?? 0})`;
                                exportCtx.filter = filterString;
                                exportCtx.drawImage(itemImg, -item.width / 2, -item.height / 2, item.width, item.height);
                                resolve();
                            };
                            itemImg.onerror = () => resolve();
                            itemImg.src = item.url;
                        });
                    } catch (e) {
                        console.error(`Lỗi khi tải ảnh item cho trang ${i + 1}:`, e);
                    }
                }
                exportCtx.restore();
            }
            // --- Hết phần vẽ ---

            // Thêm ảnh từ canvas vào trang PDF hiện tại
            const pageDataUrl = exportCvs.toDataURL('image/png');
            pdf.addImage(pageDataUrl, 'PNG', 0, 0, page.canvasWidth, page.canvasHeight);
        }

        // Tải file PDF về
        try {
            pdf.save('thiep_moi_cuoi.pdf');
        } catch (e) {
            console.error("Lỗi khi tạo hoặc tải file PDF:", e);
            alert('Đã xảy ra lỗi khi tạo file PDF.');
        }

        // Khôi phục lại item đã chọn
        if (previouslySelectedItemId) setSelectedItemId(previouslySelectedItemId);
    };


    const handleExportZip = async () => {
        const exportCvs = exportCanvasRef.current;
        if (!exportCvs || pages.length === 0) { console.error('Canvas không khả dụng.'); return; }

        const previouslySelectedItemId = selectedItemId;
        setSelectedItemId(null); await new Promise(resolve => setTimeout(resolve, 50));

        const exportCtx = exportCvs.getContext('2d');
        if (!exportCtx) { console.error('Không thể lấy context 2D.'); if (previouslySelectedItemId) setSelectedItemId(previouslySelectedItemId); return; }

        const zip = new JSZip();

        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];

            exportCvs.width = page.canvasWidth; exportCvs.height = page.canvasHeight;
            exportCtx.fillStyle = '#FFFFFF'; exportCtx.fillRect(0, 0, exportCvs.width, exportCvs.height);

            if (page.backgroundImage) {
                try {
                    const bgImage = new Image(); bgImage.crossOrigin = "anonymous";
                    await new Promise((resolve) => {
                        bgImage.onload = () => { exportCtx.drawImage(bgImage, 0, 0, page.canvasWidth, page.canvasHeight); resolve(); };
                        bgImage.onerror = () => { exportCtx.fillStyle = '#e0e0e0'; exportCtx.fillRect(0, 0, page.canvasWidth, page.canvasHeight); resolve(); };
                        bgImage.src = page.backgroundImage;
                    });
                } catch (e) { exportCtx.fillStyle = '#cccccc'; exportCtx.fillRect(0, 0, page.canvasWidth, page.canvasHeight); }
            } else { exportCtx.fillStyle = '#f8f8f8'; exportCtx.fillRect(0, 0, page.canvasWidth, page.canvasHeight); }

            const sortedItems = [...page.items].sort((a, b) => a.zIndex - b.zIndex);
            for (const item of sortedItems) {
                if (item.visible === false) continue;

                exportCtx.save();
                exportCtx.globalAlpha = item.opacity;

                const itemCenterX = item.x + item.width / 2;
                const itemCenterYOnPage = item.y + item.height / 2;

                exportCtx.translate(itemCenterX, itemCenterYOnPage);
                exportCtx.rotate((item.rotation || 0) * Math.PI / 180);

                if (item.type === 'text') {
                    exportCtx.font = `${item.fontSize}px "${item.fontFamily}"`;
                    exportCtx.fillStyle = item.color;
                    exportCtx.textAlign = 'center'; // Giữ lại nếu bạn muốn căn giữa theo chiều ngang
                    exportCtx.textBaseline = 'top'; // Giữ lại nếu bạn muốn căn theo top, nhưng chúng ta sẽ điều chỉnh Y

                    const lines = wrapText(exportCtx, item.content, item.width);

                    const lineHeight = item.fontSize * 1.3; // Giữ nguyên lineHeight nếu bạn hài lòng với 1.3
                    const totalTextBlockHeight = lines.length * lineHeight;

                    // ✅ Căn giữa theo chiều dọc trong `item.height` của item hiện tại.
                    // Nếu item.height quá nhỏ, văn bản vẫn sẽ tràn ra.
                    // Lý tưởng là item.height phải đủ lớn hoặc bạn phải tính toán và điều chỉnh
                    // item.height trước khi vẽ hoặc chấp nhận việc văn bản sẽ bị cắt/tràn.
                    const startYInItemCoords = -item.height / 2 + (item.height - totalTextBlockHeight) / 2;

                    lines.forEach((line, index) => {
                        const drawY = startYInItemCoords + index * lineHeight;
                        // Nếu bạn muốn căn giữa hoàn toàn trong khung, hãy điều chỉnh textAlign
                        exportCtx.textAlign = 'center';
                        exportCtx.textBaseline = 'middle'; // Đặt textBaseline là middle để căn giữa theo chiều dọc của mỗi dòng
                        exportCtx.fillText(line, 0, drawY + lineHeight / 2); // Cộng thêm lineHeight/2 vì textBaseline là middle
                    });

                } else if (item.type === 'image' && item.url) {
                    try {
                        const itemImg = new Image(); itemImg.crossOrigin = "anonymous";
                        await new Promise((resolve) => {
                            itemImg.onload = () => {
                                const filterString = `brightness(${item.brightness ?? 1}) contrast(${item.contrast ?? 1}) grayscale(${item.grayscale ?? 0})`;
                                exportCtx.filter = filterString;
                                exportCtx.drawImage(itemImg, -item.width / 2, -item.height / 2, item.width, item.height);
                                resolve();
                            };
                            itemImg.onerror = () => { resolve(); };
                            itemImg.src = item.url;
                        });
                    } catch (e) { console.error(`Exception khi tải ảnh item cho trang ${i + 1}:`, e); }
                }
                exportCtx.restore();
            }

            const pageDataUrl = exportCvs.toDataURL('image/png');
            const base64Data = pageDataUrl.split(',')[1];
            zip.file(`trang_${i + 1}_${page.name.replace(/[^a-z0-9]/gi, '_')}.png`, base64Data, { base64: true });
        }

        try {
            const zipBlob = await zip.generateAsync({ type: "blob" });
            const zipFileName = "thiep_moi_cuoi_cac_trang.zip";
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob); link.download = zipFileName;
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (e) { console.error("Lỗi tạo hoặc tải file ZIP:", e); }

        if (previouslySelectedItemId) setSelectedItemId(previouslySelectedItemId);
    };

    const handleToggleLayerVisibility = (itemId) => {
        const item = currentItems.find(i => i.id === itemId);
        if (item) {
            handleUpdateItem(itemId, { visible: !(item.visible ?? true) }, true);
        }
    };

    const handleToggleLayerLock = (itemId) => {
        const item = currentItems.find(i => i.id === itemId);
        if (item) {
            handleUpdateItem(itemId, { locked: !item.locked }, true);
        }
    };

    
    const handleScaleImageToFit = useCallback((itemId) => {
        const currentPage = pages.find(p => p.id === currentPageId);
        if (!currentPage || !itemId) return;

        const itemToScale = currentPage.items.find(item => item.id === itemId);
        if (!itemToScale || itemToScale.type !== 'image' || !itemToScale.url) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvasWidth = currentPage.canvasWidth;
            const canvasHeight = currentPage.canvasHeight;
            const imgAspectRatio = img.width / img.height;
            const canvasAspectRatio = canvasWidth / canvasHeight;

            let newWidth, newHeight;

            // Calculate dimensions to fit within canvas while maintaining aspect ratio
            if (imgAspectRatio > canvasAspectRatio) {
                // Image is wider than canvas ratio, fit by width
                newWidth = canvasWidth;
                newHeight = canvasWidth / imgAspectRatio;
            } else {
                // Image is taller than canvas ratio, fit by height
                newHeight = canvasHeight;
                newWidth = canvasHeight * imgAspectRatio;
            }

            // Ensure minimum size
            newWidth = Math.max(MIN_ITEM_WIDTH, newWidth);
            newHeight = Math.max(MIN_ITEM_HEIGHT, newHeight);

            // Update position to center the image on canvas
            const newX = (canvasWidth - newWidth) / 2;
            const newY = (canvasHeight - newHeight) / 2;

            handleUpdateItem(itemId, {
                width: newWidth,
                height: newHeight,
                x: newX,
                y: newY,
            }, true); // Record this as a history step
        };
        img.onerror = () => {
            console.error("Failed to load image for scaling:", itemToScale.url);
            alert("Không thể tải ảnh để thay đổi kích thước.");
        };
        img.src = itemToScale.url;
    }, [pages, currentPageId, handleUpdateItem]);

    const activeItem = currentPage ? currentItems.find(i => i.id === selectedItemId) : null;

    const handleHeaderMenuOpen = (event) => setHeaderMenuAnchorEl(event.currentTarget);
    const handleHeaderMenuClose = () => setHeaderMenuAnchorEl(null);

    const handleNavigateToGuestManagement = () => navigate('/invitation-management');

    const leftSidebarContent = (
        <Box sx={{ p: 1.5, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%' }}>
            <Button fullWidth variant="text" startIcon={<ArrowBackIcon />} sx={{ justifyContent: 'flex-start', color: 'text.secondary' }} onClick={() => navigate("/")}>Trở về</Button>
            <Button fullWidth variant="contained" startIcon={<DesignServicesIcon />} sx={{ justifyContent: 'flex-start' }} color="primary">Thiết kế</Button>
            <Divider sx={{ my: 1 }} />
            <Typography variant="overline" color="text.secondary" sx={{ px: 1 }}>Dự Án</Typography>
            <Button fullWidth variant="text" startIcon={<SaveIcon />} onClick={handleSaveProject} sx={{ justifyContent: 'flex-start' }} >Lưu Dự án</Button>
            <Button fullWidth variant="text" startIcon={<FolderOpenIcon />} onClick={handleLoadProjectClick} sx={{ justifyContent: 'flex-start' }} >Tải Dự án</Button>
            <input type="file" ref={loadProjectInputRef} onChange={handleLoadProjectFile} accept=".json" style={{ display: 'none' }} />
            <Divider sx={{ my: 1 }} />
            <Typography variant="overline" color="text.secondary" sx={{ px: 1 }}>Công cụ</Typography>
            <Button fullWidth variant="text" startIcon={<StyleIcon />} onClick={handleOpenTemplatePicker} sx={{ justifyContent: 'flex-start' }} disabled={!currentPageId}>Mẫu</Button>
            <Button fullWidth variant="text" startIcon={<TextFieldsIcon />} onClick={handleAddText} sx={{ justifyContent: 'flex-start' }} disabled={!currentPageId}>Văn bản</Button>
            <Button fullWidth variant="text" startIcon={<CloudUploadIcon />} onClick={handleOpenUserImageManagerDrawer} sx={{ justifyContent: 'flex-start' }} disabled={!currentPageId}>Tải ảnh lên</Button>
            <Button fullWidth variant="text" startIcon={<ImageIcon />} onClick={handleOpenIconPickerDrawer} sx={{ justifyContent: 'flex-start' }} disabled={!currentPageId}>Icon</Button>
            <Button fullWidth variant="text" startIcon={<CategoryIcon />} onClick={handleOpenPatternPickerDrawer} sx={{ justifyContent: 'flex-start' }} disabled={!currentPageId}>Thành phần</Button>
            <Button fullWidth variant="text" startIcon={<LabelIcon />} onClick={handleOpenBorderPickerDrawer} sx={{ justifyContent: 'flex-start' }} disabled={!currentPageId}>Tag/Khung</Button>
            <Divider sx={{ my: 1 }} />
            <Typography variant="overline" color="text.secondary" sx={{ px: 1 }}>Hiển thị & Căn chỉnh</Typography>
            <FormControlLabel control={<Checkbox checked={showGuidelines} onChange={(e) => setShowGuidelines(e.target.checked)} size="small" />} label="Đường gióng giữa" sx={{ pl: 1, color: 'text.secondary' }} />
            <FormControlLabel control={<Checkbox checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} size="small" />} label="Hiển thị lưới" sx={{ pl: 1, color: 'text.secondary' }} />
            <FormControlLabel control={<Checkbox checked={snapToGrid} onChange={(e) => setSnapToGrid(e.target.checked)} size="small" />} label="Hít vào lưới" sx={{ pl: 1, color: 'text.secondary' }} />
            <FormControlLabel control={<Checkbox checked={snapToObject} onChange={(e) => setSnapToObject(e.target.checked)} size="small" />} label="Hít vào đối tượng" sx={{ pl: 1, color: 'text.secondary' }} />
            <Box sx={{ px: 1, mt: 1 }}>
                <Typography gutterBottom variant="body2" color="text.secondary">Kích thước lưới ({gridSize}px)</Typography>
                <Slider value={gridSize} onChange={(_e, val) => setGridSize(val)} step={5} min={10} max={100} size="small" />
            </Box>
        </Box>
    );

    const rightSidebarContent = (
        <Box sx={{
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%', // Quan trọng để flexbox hoạt động đúng
            overflowY: 'hidden', // Quan trọng: Đặt overflow ở cấp cao nhất
        }}>
            <Box sx={{ p: 1, flexShrink: 0 }}> {/* flexShrink: 0 để đảm bảo phần này không co lại */}
                <Typography variant="h6" gutterBottom>Trang thiệp</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: '20vh', overflowY: 'auto', mb: 1, pr: 0.5 }}>
                    {pages.map((page) => (
                        <Card key={page.id} onClick={() => { setCurrentPageId(page.id); setSelectedItemId(null); setZoomLevel(1); setViewOffset({ x: 0, y: 0 }); if (isMobile) setRightSidebarOpen(false); }}
                            sx={{
                                cursor: 'pointer', border: `2px solid ${page.id === currentPageId ? theme.palette.primary.main : theme.palette.divider}`, '&:hover': { borderColor: theme.palette.primary.light },
                                minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', p: 0.5, position: 'relative'
                            }}>
                            <Typography variant="caption" sx={{ mt: 0.5 }}>{page.name}</Typography>
                        </Card>
                    ))}
                </Box>
                <Button startIcon={<AddCircleOutlineIcon />} fullWidth sx={{ mt: 1 }} variant="outlined" size="small" onClick={handleAddPage}>Thêm trang</Button>
            </Box>
            <Divider sx={{ my: 1, flexShrink: 0 }} />
            <Box sx={{ p: 1, flexShrink: 0 }}> {/* flexShrink: 0 để đảm bảo phần này không co lại */}
                <Typography variant="h6" gutterBottom>Các Lớp (Layers)</Typography>
                {currentPage && currentItems.length > 0 ? (
                    // Đặt một max-height cố định hoặc flexGrow tùy thuộc vào yêu cầu
                    // Để đảm bảo nó không chiếm quá nhiều không gian và đẩy phần thuộc tính ra ngoài
                    <Box sx={{ maxHeight: '25vh', overflowY: 'auto' }}>
                        <LayersPanel
                            items={currentItems}
                            selectedItemId={selectedItemId}
                            onSelectItem={handleSelectItem}
                            onToggleVisibility={handleToggleLayerVisibility}
                            onToggleLock={handleToggleLayerLock}
                            onMoveLayerUp={handleMoveLayerUp}
                            onMoveLayerDown={handleMoveLayerDown}
                        />
                    </Box>
                ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>Không có đối tượng nào.</Typography>
                )}
            </Box>
            <Divider sx={{ my: 1, flexShrink: 0 }} />
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pb: 2, p: 1 }}> {/* Dòng này được chỉnh sửa: thêm flexGrow: 1 */}
                <Typography variant="h6" gutterBottom>Thuộc tính</Typography>
                {activeItem?.type === 'text' && currentPageId && <TextPropertyEditor item={activeItem} onUpdate={handleUpdateItem} />}
                {activeItem?.type === 'image' && currentPageId && <ImagePropertyEditor item={activeItem} onUpdate={handleUpdateItem} onScaleToCanvas={handleScaleImageToFit} canvasWidth={currentCanvasWidth} canvasHeight={currentCanvasHeight} />}
                {!selectedItemId && currentPageId && <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>Chọn đối tượng để sửa.</Typography>}
                {!currentPageId && <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>Chọn hoặc thêm trang.</Typography>}
            </Box>
        </Box>
    );

    if (isMobile) {
        return (
            <>
                <Box sx={{ display: "flex", justifyContent: "center", position: "fixed", top: '200px', left: "50%", transform: "translateX(-50%)" }}>
                    <Button onClick={() => navigate("/")}>Trở về trang chủ</Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography variant="h5" color="text.primary">
                        Chức năng này chưa được tối ưu cho thiết bị di động. Vui lòng sử dụng trên máy tính bảng hoặc máy tính để bàn.
                    </Typography>
                </Box>
            </>
        );
    }

    return (
        <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column', fontFamily: 'Inter, sans-serif', bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: { xs: '4px 8px', sm: '4px 16px' }, backgroundColor: 'white', color: 'black', flexShrink: 0, boxShadow: 2, height: 56 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {invitationId ? 'Chế độ Chỉnh sửa' : 'Chế độ Tạo mới'}
                </Typography>
                <Button startIcon={<PeopleAltIcon />} variant="outlined" size="small" sx={{ ml: 2, color: 'black', borderColor: alpha(theme.palette.common.black, 0.23), '&:hover': { borderColor: theme.palette.common.black } }} onClick={handleNavigateToGuestManagement}>QL Khách mời</Button>
                <TextField 
                    label="Đường dẫn (slug)"
                    variant="outlined"
                    size="small"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    sx={{ ml: 'auto', mr: 2, minWidth: '250px' }}
                />
                <Typography variant="body2" sx={{ ml: 'auto', mr: { xs: 1, sm: 2 }, fontStyle: 'italic', display: { xs: 'none', md: 'block' } }}>{currentPage?.name || "Thiệp không tên"}</Typography>
                <Tooltip title={`Lưu dự án (.json)`}><IconButton size="small" sx={{ color: 'black' }} onClick={handleSaveProject}><SaveIcon /></IconButton></Tooltip>
                <Tooltip title={`Tải dự án (.json)`}><IconButton size="small" sx={{ color: 'black' }} onClick={handleLoadProjectClick}><FolderOpenIcon /></IconButton></Tooltip>
                <Tooltip title="Tải về">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDownloadMenuOpen}
                        size="small"
                        startIcon={<DownloadIcon />}
                    >
                        Tải về
                    </Button>
                </Tooltip>
                <Menu
                    anchorEl={downloadMenuAnchorEl}
                    open={Boolean(downloadMenuAnchorEl)}
                    onClose={handleDownloadMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={() => { handleExportZip(); handleDownloadMenuClose(); }}>Tải về file ZIP</MenuItem>
                    <MenuItem onClick={() => { handleExportPdf(); handleDownloadMenuClose(); }}>Tải về file PDF</MenuItem>
                </Menu>                
                <Tooltip title="Lưu thay đổi lên server">
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSaveChanges}
                        size="small"
                        startIcon={<CloudSyncIcon />}
                        sx={{ ml: 1 }}
                        disabled={saving} 
                    >
                        {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                    </Button>
                </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                <Box sx={{ width: LEFT_SIDEBAR_WIDTH_DESKTOP, borderRight: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper', flexShrink: 0 }}>
                    {leftSidebarContent}
                </Box>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: 'grey.200', p: { xs: 1, sm: 1.5 }, overflow: 'hidden' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: { xs: 0.5, sm: 1 }, borderBottom: `1px solid ${theme.palette.divider}`, gap: { xs: 0.2, sm: 0.5 }, flexShrink: 0, flexWrap: 'wrap', mb: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                        <Tooltip title={`Hoàn tác (Ctrl+Z)`}><IconButton size="small" onClick={handleUndo} disabled={historyIndex === 0}><UndoIcon /></IconButton></Tooltip>
                        <Tooltip title={`Làm lại (Ctrl+Y)`}><IconButton size="small" onClick={handleRedo} disabled={historyIndex >= history.length - 1}><RedoIcon /></IconButton></Tooltip>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                        {activeItem && currentPageId && !activeItem.locked && (
                            <>
                                <Tooltip title={`Sao chép (Ctrl+C)`}><IconButton size="small" onClick={handleCopy}><ContentCopyIcon /></IconButton></Tooltip>
                                <Tooltip title={`Dán (Ctrl+V)`}><IconButton size="small" onClick={handlePaste} disabled={!clipboard}><ContentPasteIcon /></IconButton></Tooltip>
                                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                                <Typography variant="caption" sx={{ mr: { xs: 0.5, sm: 1 }, flexShrink: 0, fontWeight: 500, fontSize: { xs: '0.7rem', sm: 'caption.fontSize' } }}>
                                    Đối tượng: {activeItem.type === 'text' ? `"${(activeItem).content.substring(0, 10)}${(activeItem).content.length > 10 ? "..." : ""}"` : 'Ảnh'}
                                </Typography>
                                <Tooltip title="Độ mờ"><OpacityIcon fontSize="small" sx={{ mr: { xs: 0.2, sm: 0.5 }, color: 'action.active', verticalAlign: 'middle' }} /></Tooltip>
                                <Slider value={activeItem.opacity} onChange={(_e, newValue) => handleUpdateItem(selectedItemId, { opacity: newValue }, false)} onChangeCommitted={() => handleUpdateItem(selectedItemId, {}, true)} min={0} max={1} step={0.01} sx={{ width: { xs: 60, sm: 80 }, mr: { xs: 0.5, sm: 1 } }} size="small" />
                                <Tooltip title="Đưa lên trên (Ctrl + ])"><IconButton size="small" onClick={() => handleBringToFront(selectedItemId)}><FlipToFrontIcon /></IconButton></Tooltip>
                                <Tooltip title="Đưa xuống dưới (Ctrl + [)"><IconButton size="small" onClick={() => handleSendToBack(selectedItemId)}><FlipToBackIcon /></IconButton></Tooltip>
                                <Tooltip title="Xóa đối tượng (Delete)"><IconButton size="small" color="error" onClick={() => handleDeleteItem(selectedItemId)}><DeleteIcon /></IconButton></Tooltip>
                            </>
                        )}
                        {(!activeItem || activeItem.locked) && <Tooltip title={`Dán (Ctrl+V)`}><IconButton size="small" onClick={handlePaste} disabled={!clipboard}><ContentPasteIcon /></IconButton></Tooltip>}
                    </Box>
                    <CanvasWrapper ref={canvasWrapperRef} onMouseDown={handleCanvasWrapperMouseDown} onTouchStart={handleCanvasWrapperMouseDown} onContextMenu={handleCanvasWrapperContextMenu} sx={{ flexGrow: 1, borderRadius: 1, border: `1px solid ${theme.palette.divider}` }}>
                        {currentPage ? (
                            <CanvasContainer ref={canvasContainerRef} style={{
                                width: currentCanvasWidth, height: currentCanvasHeight,
                                transform: `translateX(${viewOffset.x}px) translateY(${viewOffset.y}px) scale(${zoomLevel})`,
                                transformOrigin: 'center center', transition: isPanning.current ? 'none' : 'transform 0.1s ease-out', flexShrink: 0,
                            }}>
                                <StyledCanvas id="background-canvas" style={{ zIndex: 1 }} />
                                <StyledCanvas id="grid-canvas" style={{ zIndex: 2 }} />
                                <StyledCanvas id="snap-lines-canvas" style={{ zIndex: 9999 }} />

                                <AnimatePresence>
                                    {currentItems.filter(item => item.visible !== false).sort((a, b) => a.zIndex - b.zIndex).map(item => {
                                        if (item.type === 'text') {
                                            return <TextEditor key={item.id} item={item} onUpdateItem={handleUpdateItem}
                                                canvasWidth={currentCanvasWidth} canvasHeight={currentCanvasHeight} isSelected={selectedItemId === item.id} onSelectItem={handleSelectItem}
                                                canvasRef={canvasContainerRef} zoomLevel={zoomLevel} snapToGrid={snapToGrid} gridSize={gridSize}
                                                allItems={currentItems} onSetSnapLines={setSnapLines} snapToObject={snapToObject} />;
                                        }
                                        if (item.type === 'image') {
                                            return <ImageEditor key={item.id} item={item} onUpdateItem={handleUpdateItem}
                                                canvasWidth={currentCanvasWidth} canvasHeight={currentCanvasHeight} isSelected={selectedItemId === item.id} onSelectItem={handleSelectItem}
                                                canvasRef={canvasContainerRef} zoomLevel={zoomLevel} snapToGrid={snapToGrid} gridSize={gridSize}
                                                allItems={currentItems} onSetSnapLines={setSnapLines} snapToObject={snapToObject} />;
                                        }
                                        return null;
                                    })}
                                </AnimatePresence>
                            </CanvasContainer>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <Typography variant="h5" color="text.secondary" textAlign="center" p={2}>Vui lòng chọn hoặc thêm một trang.</Typography>
                            </Box>
                        )}
                    </CanvasWrapper>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, p: { xs: 0.5, sm: 1 }, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper', flexShrink: 0, borderRadius: '0 0 4px 4px', mt: 1 }}>
                        <IconButton onClick={handleZoomOut} disabled={zoomLevel <= MIN_ZOOM || !currentPageId} size="small" aria-label="Thu nhỏ"><ZoomOutIcon /></IconButton>
                        <Slider value={zoomLevel} onChange={handleZoomSliderChange} min={MIN_ZOOM} max={MAX_ZOOM} step={0.01} sx={{ width: { xs: 100, sm: 150 }, mx: { xs: 0.5, sm: 1 } }} size="small" disabled={!currentPageId} />
                        <Typography variant="body2" sx={{ minWidth: { xs: '40px', sm: '50px' }, textAlign: 'center' }}>{currentPageId ? Math.round(zoomLevel * 100) : 0}%</Typography>
                        <IconButton onClick={handleZoomIn} disabled={zoomLevel >= MAX_ZOOM || !currentPageId} size="small" aria-label="Phóng to"><ZoomInIcon /></IconButton>
                    </Box>
                </Box>
                <Box sx={{ width: RIGHT_SIDEBAR_WIDTH_DESKTOP, borderLeft: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper', flexShrink: 0 }}>
                    {rightSidebarContent}
                </Box>
            </Box>

            <canvas ref={exportCanvasRef} style={{ display: 'none' }} />
            <Drawer open={openTemplatePicker} onClose={() => setOpenTemplatePicker(false)} anchor="left" PaperProps={{ sx: { width: { xs: '85vw', sm: 300 } } }}>
                <Box sx={{ p: 1, boxSizing: 'border-box' }}>
                    <TemplatePicker templates={backendTemplates} onSelectTemplate={handleSelectTemplate} />
                </Box>
            </Drawer>
            <Drawer open={openIconPickerDrawer} onClose={handleCloseIconPickerDrawer} anchor="left" PaperProps={{ sx: { width: { xs: MOBILE_DRAWER_WIDTH, sm: LEFT_SIDEBAR_WIDTH_DESKTOP + 60 } } }}>
                <Box sx={{ p: 1, boxSizing: 'border-box' }}> <GenericImagePicker images={iconImages} onSelectImage={handleAddIconFromPicker} title="Chọn Icon" /> </Box>
            </Drawer>
            <Drawer open={openUserImageManagerDrawer} onClose={handleCloseUserImageManagerDrawer} anchor="left" PaperProps={{ sx: { width: { xs: MOBILE_DRAWER_WIDTH, sm: LEFT_SIDEBAR_WIDTH_DESKTOP + 80 } } }}>
                <Box sx={{ p: 1, boxSizing: 'border-box' }}> <UserImageManager userImages={userUploadedImages} onSelectUserImage={handleAddUserImageToCanvas} onImageUploaded={handleUserImageFileUpload} /> </Box>
            </Drawer>
            <Drawer open={openPatternPickerDrawer} onClose={handleClosePatternPickerDrawer} anchor="left" PaperProps={{ sx: { width: { xs: MOBILE_DRAWER_WIDTH, sm: LEFT_SIDEBAR_WIDTH_DESKTOP + 60 } } }}>
                <Box sx={{ p: 1, boxSizing: 'border-box' }}> <GenericImagePicker images={componentImages} onSelectImage={handleAddPatternImageFromPicker} title="Chọn Thành Phần" /> </Box>
            </Drawer>
            <Drawer open={openBorderPickerDrawer} onClose={handleCloseBorderPickerDrawer} anchor="left" PaperProps={{ sx: { width: { xs: MOBILE_DRAWER_WIDTH, sm: LEFT_SIDEBAR_WIDTH_DESKTOP + 60 } } }}>
                <Box sx={{ p: 1, boxSizing: 'border-box' }}> <GenericImagePicker images={tagImages} onSelectImage={handleAddBorderImageFromPicker} title="Chọn Tag/Khung" /> </Box>
            </Drawer>
        </Box>
    );
};

// The main component to be exported
const DesignContent = () => {
    const editorTheme = createTheme({
        palette: {
            primary: { main: '#000000' },
            secondary: { main: '#333333' },
            success: { main: '#2e7d32' }
        },
        typography: { fontFamily: 'Inter, sans-serif', button: { textTransform: 'none' } },
    });

    return (
        <ThemeProvider theme={editorTheme}>
            <WeddingInvitationEditor />
        </ThemeProvider>
    );
};

export default DesignContent;