import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import '../less/index.less';

const root: HTMLElement | null = document.getElementById('root');

if (root instanceof HTMLElement) {
	createRoot(root).render(
		<StrictMode>
			<App />
		</StrictMode>
	);
}
