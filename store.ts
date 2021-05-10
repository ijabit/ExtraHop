import { WordMap } from "./WordMap";

export const store = {
    state: {
        currentWordMap: null as WordMap | null
    },
    setCurrentWordMap(wordMap: WordMap) {
        this.state.currentWordMap = wordMap;
    }
};