import { Outlet } from 'react-router-dom';
import Eula, { EulaProps } from './Eula';
import Navbar from './Navbar';

export default function Layout(props: EulaProps) {
	return (
		<>
			<Navbar eula={props.eula} />
			<main role="main">
				<Outlet />
			</main>
			<Eula eula={props.eula} setEula={props.setEula} />
		</>
	);
}
