import {Button, Grid2 as Grid, TextField} from '@mui/material';
import {RunningEvent} from './RunningEvent';

export interface RunningEventControlsProps {
    event: RunningEvent;
    onChangeSpeed: (event: RunningEvent, speed: number) => void;
}

export const RunningEventControls = ({event, onChangeSpeed}: RunningEventControlsProps) => {
    return (
        <Grid container display="flex" alignItems="center">
            <Grid>
                <Button variant="contained" sx={{marginLeft: 2}}
                        onClick={() => onChangeSpeed(event, event.speed - 0.1)}>-</Button>
            </Grid>
            <Grid>
                <TextField type={"number"} value={event.speed} slotProps={{htmlInput: {step: 0.1}}}
                           sx={{top: 0, bottom: 0, marginLeft: 2, width: 55}}
                           onChange={(e) => onChangeSpeed(event, parseFloat(e.target.value))}/>
            </Grid>
            <Grid>
                <Button variant="contained" sx={{marginLeft: 2}}
                        onClick={() => onChangeSpeed(event, event.speed + 0.1)}>+</Button>
            </Grid>
        </Grid>
    )
}
