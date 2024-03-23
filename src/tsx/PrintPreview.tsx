import { HistoryState } from './HomePage';

export default function PrintPreview() {
	const historyState: HistoryState = window.history.state?.usr?.state;

	console.log(historyState);

	return (
		<div>Print Preview!</div>
	);
}
