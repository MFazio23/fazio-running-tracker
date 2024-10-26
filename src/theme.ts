import {createTheme} from '@mui/material/styles';
import {red} from '@mui/material/colors';

export const generateTheme = () => createTheme({
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: '#B28AE4',
                },
                secondary: {
                    main: '#C9AAF2',
                },
                error: {
                    main: red.A400,
                },
                background: {
                    default: '#F7F0F0',
                    paper: '#FCF5F5'
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    main: '#B28AE4',
                },
                secondary: {
                    main: '#C9AAF2',
                },
                error: {
                    main: red.A400,
                },
            },
        },
    }
});
