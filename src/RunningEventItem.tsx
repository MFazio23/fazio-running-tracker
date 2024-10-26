import {differenceInSeconds} from 'date-fns';
import {Box, Chip, IconButton, ListItem, Typography} from '@mui/material';
import {RunningEventControls} from './RunningEventControls';
import {RunningEvent} from './RunningEvent';
import {Delete} from '@mui/icons-material';

export interface RunningEventItemProps {
    event: RunningEvent;
    onChangeSpeed: (event: RunningEvent, speed: number) => void;
    onTypeChipClicked: (event: RunningEvent) => void;
    onDeleteButtonClicked: (event: RunningEvent) => void;
}

export const RunningEventItem = (
    {
        event,
        onChangeSpeed,
        onTypeChipClicked,
        onDeleteButtonClicked
    }: RunningEventItemProps
) => {
    const duration = differenceInSeconds(event.end || new Date(), event.start);
    const durationText = new Date(duration * 1000).toISOString().substring(14, 19);
    const distance = duration * event.speed / 3600;
    return (
        event ?
            <ListItem sx={{padding: 0}}>
                <Box position="relative" mr={2} width="100%" display="flex" flexDirection="row" alignItems="center">
                    <Chip label={event.type} sx={{fontSize: 24, margin: 2, width: 100, height: 40}}
                          color={event.type === 'Walk' ? 'success' : 'error'}
                          onClick={() => onTypeChipClicked(event)}/>
                    <Box mr={2}>
                        {/* Duration */}
                        <Typography variant={"h6"} sx={{marginLeft: 2}}>{durationText}</Typography>
                        {/* Distance */}
                        <Typography variant={"h6"} sx={{marginLeft: 2}}>{distance.toFixed(2)} mi</Typography>
                    </Box>
                    <RunningEventControls event={event} onChangeSpeed={onChangeSpeed}/>
                    <IconButton onClick={() => onDeleteButtonClicked(event)}
                                sx={{position: 'absolute', top: 0, bottom: 0, right: 0}}>
                        <Delete/>
                    </IconButton>
                </Box>
            </ListItem>
            : null
    )
}
