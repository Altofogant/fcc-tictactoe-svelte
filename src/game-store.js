import { readable } from 'svelte/store';

let connection;
let connectionTimer;
let message;

const connect = () => {
    try {
        if (!connection || connection.readyState >= 2) {
            connection = new WebSocket(process.env.wsUrl);

            connection.onClose = (e) => {
                console.log(e, 'closed');
                connectionTimer = setInterval(() => {
                    connect();
                }, 500);
            }

            connection.onopen = () => {
                clearInterval(connectionTimer);
                console.log('connected');
            }

            connection.onmessage = (e) => {
                message = e.data;
            }
        }
    } catch(e) {
        console.log(e, 'logging error');
    }
};

const store = new readable(undefined, (set) => {
    setInterval(() => {
        if (message) {
            set(JSON.parse(message));
            message = undefined;
        }
    }, 5);

    return () => {
        if (connection) {
            connection.close();
        }
        clearInterval(messageTimer);
    };
});

connect();

export default {
    subscribe: store.subscribe,
    isConnected: () => connection.readyState <= 1
}