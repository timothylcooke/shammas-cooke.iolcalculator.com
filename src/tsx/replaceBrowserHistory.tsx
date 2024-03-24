import { HistoryState } from './HomePage';

export default function replaceBrowserHistory(state: HistoryState | undefined) {
	const newState = Object.assign({}, window.history.state);
	newState.usr.state = state;
	window.history.replaceState(newState, '', window.location.pathname);
}
