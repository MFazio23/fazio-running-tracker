import {
    Box,
    Button, Dialog,
    DialogActions, DialogContent, DialogContentText, DialogTitle,
    IconButton,
    List,
    Paper,
    Stack,
    Typography,
    useColorScheme,
    useTheme
} from '@mui/material';
import {useEffect, useState} from 'react';
import {differenceInSeconds} from 'date-fns';
import {RunningEvent, RunningEventItem} from './RunningEventItem.tsx';
import {Nightlight, Refresh, WbSunny} from '@mui/icons-material';

export type AlertDialogType = 'resetEvents' | '';

const defaultSpeeds = {
    walk: 3,
    run: 4,
}

export const RunningScreen = () => {
    const [startDateTime, setStartDateTime] = useState<Date | undefined>(undefined);
    const [totalTime, setTotalTime] = useState<string>("--:--");
    const [totalDistance, setTotalDistance] = useState<number>(0);
    const [events, setEvents] = useState<RunningEvent[]>(JSON.parse(localStorage.getItem('events') || '[]') || []);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [dialogType, setDialogType] = useState<AlertDialogType>('');

    const theme = useTheme();

    const {mode, setMode} = useColorScheme();

    const addEvent = (type: "Walk" | "Run") => {
        const eventDate = new Date();
        if (!startDateTime) {
            setStartDateTime(eventDate);
        }

        const newEvent = {
            id: `${type}-${eventDate.getTime()}`,
            type,
            start: eventDate,
            speed: type === 'Walk' ? defaultSpeeds.walk : defaultSpeeds.run
        };

        const lastEvent = events.pop()!;

        const newEvents = [...events];

        if (lastEvent) {
            newEvents.push({...lastEvent, end: eventDate});
        }

        newEvents.push(newEvent);

        setEvents(newEvents);
        localStorage.setItem('events', JSON.stringify(newEvents));
    }

    const handleChangeColorScheme = () => {
        setMode(mode === 'light' ? 'dark' : 'light');
    }

    const handleChangeSpeed = (event: RunningEvent, speed: number) => {
        const safeSpeed = isNaN(speed) ? 0 : speed;
        const newEvents = events.map(e => e.id === event.id ? {...e, speed: safeSpeed} : e);
        setEvents(newEvents);
    }

    const handleOnTypeChipClicked = (event: RunningEvent) => {
        const newEvents: RunningEvent[] = events.map(e => e.id === event.id ? {...e, type: e.type === 'Walk' ? 'Run' : 'Walk'} : e);
        setEvents(newEvents);
    }

    const handleReset = () => {
        setDialogTitle('Reset Events');
        setDialogContent('Are you sure you want to reset all events?');
        setDialogType('resetEvents');
        setIsDialogOpen(true);
    }

    const handleCloseDialog = (alertDialogType: AlertDialogType, isConfirmed: boolean) => {
        setIsDialogOpen(false);
        if (isConfirmed) {
            if (alertDialogType === 'resetEvents') {
                setEvents([]);
                setStartDateTime(undefined);
                setTotalDistance(0);
                setTotalTime('--:--');
                localStorage.setItem('events', '[]');
            }
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (startDateTime) {
                const elapsedTime = differenceInSeconds(new Date(), startDateTime);
                // Format as 00:00
                const formattedElapsedTime = new Date(elapsedTime * 1000).toISOString().substring(14, 19);
                setTotalTime(formattedElapsedTime);

                // Calculate total distance
                const totalDistance = events.reduce((total, event) => {
                    const duration = differenceInSeconds(event.end || new Date(), event.start);
                    const distance = duration * event.speed / 3600;
                    return total + distance;
                }, 0);

                setTotalDistance(totalDistance);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [startDateTime, events]);

    return (
        <Box position='relative'>
            <IconButton aria-label={'reset'} onClick={() => handleReset()}
                        sx={{position: 'absolute', top: 0, left: 0, margin: 2}}>
                <Refresh/>
            </IconButton>
            <IconButton aria-label={'change-color-scheme'} onClick={() => handleChangeColorScheme()}
                        sx={{position: 'absolute', top: 0, right: 0, margin: 2}}>
                {theme.palette.mode === 'light' ? <Nightlight/> : <WbSunny/>}
            </IconButton>

            <Typography variant={"h2"}>Running</Typography>

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
            <Paper style={{maxHeight: 700, overflow: 'auto', marginTop: 16}}>
                <List>
                    {events.map((event) => (
                        <RunningEventItem key={event.id} event={event} onChangeSpeed={handleChangeSpeed} onTypeChipClicked={handleOnTypeChipClicked}/>
                    ))}
                </List>
            </Paper>

            <Dialog
                open={isDialogOpen}
                onClose={(isConfirmed: boolean) => handleCloseDialog(dialogType, isConfirmed)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{dialogContent}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCloseDialog(dialogType, false)}>Cancel</Button>
                    <Button onClick={() => handleCloseDialog(dialogType, true)} autoFocus>OK</Button>
                </DialogActions>
            </Dialog>

        </Box>
    )
}

