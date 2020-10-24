import {getTextNodes, renderComponent} from 'react-component-driver';
import {buildHistoryScreen} from '../screens/HistoryScreen';
import {act, ReactTestRenderer} from 'react-test-renderer';
import ChoiceHistory, {HistoryItem, Storage} from '../utils/HistoryItem';
import {Country} from '../constants/Game';
import {CHOICE_HISTORY} from '../constants/AsyncStorage';

const mockChoices: HistoryItem[] = [
  {
    id: '0',
    guess: Country.France,
    answer: Country.France,
    imgUrl: '',
  },
  {
    id: '1',
    guess: Country.Italy,
    answer: Country.Italy,
    imgUrl: '',
  },
];

let component: ReactTestRenderer;
describe('HistoryScreen', () => {
  const storage: Storage = {setItem: jest.fn(), getItem: jest.fn()};
  const choiceHistory = new ChoiceHistory(storage);

  beforeEach(() => {
    storage.setItem = jest.fn();
    storage.getItem = jest.fn();
    component = renderComponent(buildHistoryScreen(choiceHistory), {});
  });

  it('renders empty list', async () => {
    storage.getItem = jest.fn().mockResolvedValue(null);
    await act(async () => {
      await flushPromises();
    });
    expect(getTextNodes(component)).toEqual([]);
  });

  it('reads and renders multiple choices from storage', async () => {
    storage.getItem = jest.fn().mockResolvedValue(JSON.stringify(mockChoices));

    await act(async () => {
      await flushPromises();
    });

    const choices = getTextNodes(component);

    expect(choices).toEqual([Country.France, Country.Italy]);
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith(CHOICE_HISTORY);
  });
});
