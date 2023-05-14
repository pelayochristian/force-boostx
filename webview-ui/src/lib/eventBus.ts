interface EventBus {
    events: { [eventName: string]: Array<Function> };
    subscribe: (eventName: string, callback: Function) => void;
    emit: (eventName: string, data: any) => void;
}

const eventBus: EventBus = {
    events: {},
    subscribe(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    },
    emit(eventName, data) {
        const callbacks = this.events[eventName] || [];
        callbacks.forEach((callback) => {
            callback(data);
        });
    },
};

export default eventBus;
