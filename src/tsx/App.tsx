import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Documentation from './Documentation';
import HomePage from './HomePage';
import PrintPreview from './PrintPreview';
import Layout from './Layout';
import Settings from '../api/Settings';
import ApiDocs from './ApiDocs';
import ApiPage from './ApiPage/ApiPage';

export default function App() {
	const [eula, setEula] = useState(((window.history.state || {}).usr || {}).eula === true);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout eula={eula} setEula={setEula} />}>
					<Route path="/" element={<HomePage eula={eula} />} />
					<Route path="/PrintPreview" element={<PrintPreview />} />
					<Route path="/Documentation" element={<Documentation eula={eula} />} />
					<Route path={Settings.apiUrl} element={<ApiDocs eula={eula} />} />
					<Route path={`${Settings.apiUrl}/preop`} element={<ApiPage eula={eula} page='preop' />} />
					<Route path={`${Settings.apiUrl}/postop`} element={<ApiPage eula={eula} page='postop' />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
