import Sound from 'react-native-sound';

const soundStorage = {};

const load = (name) => {
    const path = `sounds/${name}.mp3`;
    soundStorage[name] = () => {
        console.warn(`sounds.js: file ${path} not loaded`);
    };
    const sound = new Sound(path, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            console.error(`sounds.js: failed to load the sound ${path}`, error);
        } else {
            console.log(`sounds.js: duration in seconds: ${sound.getDuration()}`);
            soundStorage[name] = () => {
                sound.play(result => {
                    console.log(`sounds.js: file ${path} played: ${result}`);
                });
            };
        }
    });
};

load('ack');
load('destroy');
load('received');
load('sending');
load('sent');

export default soundStorage;
