import { WorkerService } from 'rn-workers'

const worker = new WorkerService();
worker.onmessage = message => {
    //Reply the message back to app
    worker.postMessage("Hello from the other side (" + message + ")")
};
