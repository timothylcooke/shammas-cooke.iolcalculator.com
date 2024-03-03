import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Documentation from './Documentation';
import HomePage from './HomePage';
import Layout from './Layout';

export default function App() {
	const [eula, setEula] = useState(((window.history.state || {}).usr || {}).eula === true);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout eula={eula} setEula={setEula} />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/Documentation" element={<Documentation />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
