import {differenceInSeconds} from 'date-fns';
import {Chip, ListItem, Typography} from '@mui/material';
import {RunningEventControls} from './RunningEventControls.tsx';

export interface RunningEvent {
    id: string;
    type: "Walk" | "Run";
    start: Date;
    end?: Date;
    speed: number;
}

export interface RunningEventItemProps {
    event: RunningEvent;
    onChangeSpeed: (event: RunningEvent, speed: number) => void;
    onTypeChipClicked: (event: RunningEvent) => void;
}
export const RunningEventItem = ({event, onChangeSpeed, onTypeChipClicked}: RunningEventItemProps) => {
    const duration = differenceInSeconds(event.end || new Date(), event.start);
    const durationText = new Date(duration * 1000).toISOString().substring(14, 19);
    const distance = duration * event.speed / 3600;
    return (
        event ?
            <ListItem sx={{padding: 0}}>
                <Chip label={event.type} sx={{fontSize: 24, margin: 2, width: 100, height: 40}}
                      color={event.type === 'Walk' ? 'success' : 'error'}
                onClick={() => onTypeChipClicked(event)}/>
                {/* Duration */}
                <Typography variant={"h6"} sx={{marginLeft: 2}}>{durationText}</Typography>
                {/* Distance */}
                <Typography variant={"h6"} sx={{marginLeft: 2}}>{distance.toFixed(2)}</Typography>
                <RunningEventControls event={event} onChangeSpeed={onChangeSpeed}/>
            </ListItem>
            : null
    )
}
