import './App.css'
import {Box, Container} from '@mui/material';
import {RunningScreen} from './RunningScreen';

function App() {
    return (
        <Container id="root" maxWidth={"sm"}>
            <Box>
                <RunningScreen/>
            </Box>
        </Container>
    )
}

export default App
