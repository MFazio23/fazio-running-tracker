import {Box, IconButton, Link, List, Paper, Typography, useColorScheme, useTheme} from '@mui/material';
import {useEffect, useState} from 'react';
import {differenceInSeconds} from 'date-fns';
import {RunningEventItem} from './RunningEventItem';
import {Nightlight, Refresh, WbSunny} from '@mui/icons-material';
import {parseRunningEventsFromStorage, RunningEvent} from './RunningEvent';
import {AlertDialog} from './dialogs/AlertDialog';
import {RunningControls} from '../RunningControls';

export type AlertDialogType = 'resetEvents' | '';

const defaultSpeeds = {
    walk: 3,
    run: 4,
}

export const RunningScreen = () => {
    const [events, setEvents] = useState<RunningEvent[]>(parseRunningEventsFromStorage());
    const [startDateTime, setStartDateTime] = useState<Date | undefined>(events[0]?.start);
    const [totalTime, setTotalTime] = useState<string>("--:--");
    const [totalDistance, setTotalDistance] = useState<number>(0);

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
            localStorage.setItem('runningStartDateTime', eventDate.toISOString());
        }

        const newEvent = {
            id: `${type}-${eventDate.getTime()}`,
            type,
            start: eventDate,
            speed: type === 'Walk' ? defaultSpeeds.walk : defaultSpeeds.run
        };

        const lastEvent = events.find(e => !e.end);

        const newEvents = [...events].filter(e => e.id !== lastEvent?.id);

        if (lastEvent) {
            newEvents.push({...lastEvent, end: eventDate});
        }

        newEvents.push(newEvent);

        setEvents(newEvents);
        localStorage.setItem('runningEvents', JSON.stringify(newEvents));
    }

    const updateEvent = (event: RunningEvent) => {
        const newEvents = events.map(e => e.id === event.id ? event : e);
        setEvents(newEvents);
        localStorage.setItem('runningEvents', JSON.stringify(newEvents));
    }

    const handleChangeColorScheme = () => {
        setMode(mode === 'light' ? 'dark' : 'light');
    }

    const handleChangeSpeed = (event: RunningEvent, speed: number) => {
        const safeSpeed = isNaN(speed) ? "0" : speed.toFixed(1);

        updateEvent({...event, speed: parseFloat(safeSpeed)});
    }

    const handleOnTypeChipClicked = (event: RunningEvent) => {
        const newEvents: RunningEvent[] = events.map(e => e.id === event.id ? {
            ...e,
            type: e.type === 'Walk' ? 'Run' : 'Walk'
        } : e);
        setEvents(newEvents);
    }

    const handleOnDeleteButtonClicked = (event: RunningEvent) => {
        const newEvents: RunningEvent[] = events.filter(e => e.id !== event.id);
        setEvents(newEvents);
        localStorage.setItem('runningEvents', JSON.stringify(newEvents));
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
                localStorage.setItem('runningEvents', '[]');
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
        <Box position='relative' height="100%">
            <IconButton aria-label={'reset'} onClick={() => handleReset()}
                        sx={{position: 'absolute', top: 0, left: 0, margin: 2}}>
                <Refresh/>
            </IconButton>
            <IconButton aria-label={'change-color-scheme'} onClick={() => handleChangeColorScheme()}
                        sx={{position: 'absolute', top: 0, right: 0, margin: 2}}>
                {theme.palette.mode === 'light' ? <Nightlight/> : <WbSunny/>}
            </IconButton>

            <Typography variant={"h2"}>Running Tracker</Typography>

            <Box display="flex" flexDirection="column" flex="1">
                <RunningControls totalDistance={totalDistance} totalTime={totalTime} addEvent={addEvent}/>

                <Paper style={{flex: 1, maxHeight: 800, overflow: 'auto', marginTop: 16}}>
                    <List>
                        {events
                            .sort((a, b) => b.start.getTime() - a.start.getTime())
                            .map((event) => (
                                <RunningEventItem key={event.id} event={event} onChangeSpeed={handleChangeSpeed}
                                                  onTypeChipClicked={handleOnTypeChipClicked}
                                                  onDeleteButtonClicked={handleOnDeleteButtonClicked}/>
                            ))}
                    </List>
                </Paper>

                <Box>
                    <Link href={'https://www.flaticon.com/free-icon/athlete_11010139'}>
                        Athlete/Runner icons created by Freepik - Flaticon
                    </Link>
                </Box>
            </Box>

            <AlertDialog dialogType={dialogType} isOpen={isDialogOpen} title={dialogTitle} content={dialogContent}
                         handleCloseDialog={handleCloseDialog}/>
        </Box>
    )
}

