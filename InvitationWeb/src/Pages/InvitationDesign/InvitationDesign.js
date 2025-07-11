// src/Pages/InvitationDesign/InvitationDesign.js

import DesignContent from './Components/Content/DesignContent';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles'; // Bỏ useTheme, styled
import './InvitationDesign.css';

// Cập nhật theme để khớp với màu sắc và font chữ của website
const editorTheme = createTheme({
    palette: {
        primary: {
            main: '#27548A', // <-- THAY ĐỔI: Sử dụng màu --color-primary từ App.css
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#CDD7E5', // <-- THAY ĐỔI: Sử dụng màu --color-secondary từ App.css
            contrastText: '#333333',
        },
        text: {
            primary: '#333', // <-- THAY ĐỔI: Sử dụng màu --color-text-dark
            secondary: '#666', // <-- THAY ĐỔI: Sử dụng màu --color-text-light
        }
    },
    typography: {
        fontFamily: "'Be Vietnam Pro', 'Inter', sans-serif", // <-- THAY ĐỔI: Sử dụng font --font-primary
         button: {
            textTransform: 'none'
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                outlinedPrimary: {
                    borderColor: '#27548A',
                    color: '#27548A',
                    '&:hover': {
                        borderColor: alpha('#27548A', 0.7),
                        backgroundColor: alpha('#27548A', 0.04),
                    }
                }
            }
        },
        MuiSlider : {
            styleOverrides: {
                root: {
                    color: '#27548A', // Cập nhật màu cho Slider
                }
            }
        }
    }
});

export default function Design() {
    return (
        <>
            <ThemeProvider theme={editorTheme}>
                <DesignContent />
            </ThemeProvider>
        </>
    )
}