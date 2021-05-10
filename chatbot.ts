import * as readline from "readline";
import { store } from "./store";
import { TopTenWords } from "./TopTenWords";
import { WordMap } from "./WordMap";

const handleUserMessage = (message: string, state: WordMap) => {
    // assuming username doesn't contain ": " and that there always is ": " to denote text after a username
    const messageText = message.split(/: (.+)/)[1];
    messageText.toLowerCase().split(" ").filter(x => x !== null).forEach((word: string) => {
        state[word] = (state[word] as number || 0) + 1;
    });

    return state;
};

const generateTopTenMessage = (state: WordMap) => {
    let result = Object.entries(state)
        .sort((a, b) => b[1] - a[1])
        .map(entry => `"${entry[0]}": ${entry[1]}`)
        .slice(0, 10)
        .join("\n");

    return { state, message: `\nTop 10 Chat Word Counts:\n${result}` } as TopTenWords;
};

const getInitialState = () => {
    // using Object.create because an object literal has a bunch of keys and Map() is slower
    return Object.create(null) as WordMap;
};

// running application:
console.log("Chatroom running! Type messages in the form of '[username]: [messageText]'");
const reader = readline.createInterface({ input: process.stdin, output: process.stdout });
reader.on("line", (message: string) => {
    if (message.indexOf(": ") < 0) {
        message = `Anonymous: ${message}`;
    }
    const updatedState = handleUserMessage(message, store.state.currentWordMap || getInitialState());
    store.setCurrentWordMap(updatedState);
});
setInterval(() => {
    const { message } = generateTopTenMessage(store.state.currentWordMap || getInitialState());
    store.setCurrentWordMap(getInitialState());
    console.log(message);
}, 15000);