import { Outlet } from 'react-router-dom';
import Eula from './Eula';
import Navbar from './Navbar';

type LayoutProps = {
	eula: boolean,
	setEula: (value: boolean) => void
};

export default function Layout(props: LayoutProps) {
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
