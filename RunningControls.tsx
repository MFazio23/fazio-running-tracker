import {Box, Button, Stack, Typography} from '@mui/material';

export interface RunningControlsProps {
    totalTime: string;
    totalDistance: number;
    addEvent: (type: "Walk" | "Run") => void;
}

export const RunningControls = ({totalTime, totalDistance, addEvent}: RunningControlsProps) => {
    return (
        <Box display={"flex"} justifyContent={"space-evenly"} pt={2}>
            <Button variant="contained" color="success" size="large" onClick={() => addEvent('Walk')}
                    sx={{mb: 1, minWidth: 200}}><Typography variant="h3">Walk</Typography></Button>
            <Stack>
                <Typography variant="h4">{totalTime}</Typography>
                <Typography variant="h4">{totalDistance.toFixed(2)} mi.</Typography>
            </Stack>
            <Button variant="contained" color="error" size="large" onClick={() => addEvent('Run')}
                    sx={{mb: 1, minWidth: 200}}><Typography variant="h3">Run</Typography></Button>
        </Box>
    )
}
