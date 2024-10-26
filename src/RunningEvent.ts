export interface RunningEvent {
    id: string;
    type: "Walk" | "Run";
    start: Date;
    end?: Date;
    speed: number;
}

export const defaultSpeeds = {
    walk: 3,
    run: 4,
}

export const parseRunningEventsFromStorage = (): RunningEvent[] => {
    const runningEvents = JSON.parse(localStorage.getItem('runningEvents') || '[]') || [];

    return runningEvents.map((event: RunningEvent) => {
        return {
            ...event,
            start: new Date(event.start),
            end: event.end ? new Date(event.end) : undefined
        }
    });
}
