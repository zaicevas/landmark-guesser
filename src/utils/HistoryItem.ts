import {Country, Landmark} from '../constants/Game';
import {CHOICE_HISTORY} from '../constants/AsyncStorage';

export interface HistoryItem {
  id: string;
  guess: Country;
  answer: Country;
  imgUrl: string;
}

export interface Storage {
  getItem(
    key: string,
    callback?: (error?: Error, result?: string) => void,
  ): Promise<string | null>;
  setItem(
    key: string,
    value: string,
    callback?: (error?: Error) => void,
  ): Promise<void>;
}

// TODO: use either 'guess' or 'choice' to avoid confussion
class ChoiceHistory {
  constructor(private storage: Storage) {}

  addChoiceToHistory = async (landmark: Landmark, choice: Country) => {
    const choiceHistory = await this.getChoicesHistory();

    const newChoice: HistoryItem = {
      id: choiceHistory.length.toString(),
      guess: choice,
      answer: landmark.country,
      imgUrl: landmark.imageUrl,
    };

    this.storage.setItem(
      CHOICE_HISTORY,
      JSON.stringify([newChoice, ...choiceHistory]),
    );
  };

  getChoicesHistory = async (): Promise<HistoryItem[]> => {
    return JSON.parse((await this.storage.getItem(CHOICE_HISTORY)) || '[]');
  };
}

export default ChoiceHistory;
