// example interface to contain vacation data, real world would have many more fields
export interface IVacation {
    start: Date;
    end: Date;
    title: string;
}

// here we do the local storage management, another possibility would be to create a client storage module
const localStorageKey = "DemoVacationStore";
const onVacationAddedActions: ((vacation: IVacation) => void)[] = [];

// stub method if we needed a shared way to load all vacations from the backing store
export function loadVacations(): IVacation[] {

    // here we would load the vacations from whatever store
    return [];
}

// example shared method for creating a new vacation
export function createVacation(vacation: IVacation): boolean {

    // here we would do whatever with the vacation information
    // let's just stick it in local storage for this demo
    let vacations: IVacation[] = JSON.parse(localStorage.getItem(localStorageKey));
    if (vacations === null) {
        vacations = [];
    }

    vacations.push(vacation);

    localStorage.setItem(localStorageKey, JSON.stringify(vacations));

    // now fire the event to let any subscribers know we have added a vacation
    const actions = [...onVacationAddedActions];
    for (let i = 0; i < actions.length; i++) {

        // we just pass the vacation, could include the whole collection, index
        // whatever to the handlers
        actions[i](vacation);
    }

    // if there are errors we could return false or throw, say if we got an error writing to the backend system to store the vacation
    return true;
}

// example of exposing a shared event to which any ACE/WebPart could subscribe for when a vacation is added
// this pattern can be expanded for any number of events, and many possibilities exist for async event management
// this example strives for the simplest possible implementation with no deps
export function onVacationAdded(action: (vacation: IVacation) => void): void {

    // simple tracking of listeners
    onVacationAddedActions.push(action);
}
