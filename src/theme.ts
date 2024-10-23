import {createTheme} from '@mui/material/styles';
import {red} from '@mui/material/colors';

export const generateTheme = () => createTheme({
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: '#00b140',
                },
                secondary: {
                    main: '#468165',
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
                    main: '#00b140',
                },
                secondary: {
                    main: '#468165',
                },
                error: {
                    main: red.A400,
                },
            },
        },
    }
});
