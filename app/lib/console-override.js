import { observable, reaction } from 'mobx';
import { TinyDb } from '../lib/icebear';

const VERBOSE_LOGS_KEY = 'verboseLogs';

class ConsoleOverride {
    @observable verbose = false;

    async areVerboseLogsEnabled() {
        return process.env.VERBOSE_LOGS || TinyDb.system.getValue(VERBOSE_LOGS_KEY);
    }

    async configureConsole() {
        this.verbose = await this.areVerboseLogsEnabled();
        reaction(() => this.verbose, value => (value ? TinyDb.system.setValue(VERBOSE_LOGS_KEY, value) :
            TinyDb.system.removeValue(VERBOSE_LOGS_KEY)));
        const { verbose } = this;

        if (console._errorOriginal) {
            console.error = console._errorOriginal;
        }

        global.ErrorUtils && global.ErrorUtils.setGlobalHandler((...args) => {
            console.error(`App.js: unhandled error`);
            console.error(args);
        });

        console.stack = [];
        console.stackPush = (msg) => {
            const MAX = 300;
            const STEP = 50;
            const index = console.stack.length;
            const delta = index - MAX;
            const time = new Date();
            console.stack.push({ msg, time });
            if (delta > STEP) console.stack.splice(0, delta);
        };

        const { log } = console;
        console.log = function () {
            __DEV__ && log.apply(console, arguments);
            Array.from(arguments).forEach(console.stackPush);
        };

        const { warn } = console;
        console.warn = function () {
            __DEV__ && warn.apply(console, arguments);
            Array.from(arguments).forEach(console.stackPush);
        };

        console.disableYellowBox = true;

        const { error } = console;
        console.error = function () {
            __DEV__ && error.apply(console, arguments);
            Array.from(arguments).forEach(console.stackPush);
        };

        const { debug } = console;
        console.debug = function () {
            __DEV__ && verbose && debug.apply(console, arguments);
            verbose && Array.from(arguments).forEach(console.stackPush);
        };

        console.debug('console-override.js: debug logs are enabled');
    }
}

export default new ConsoleOverride();
