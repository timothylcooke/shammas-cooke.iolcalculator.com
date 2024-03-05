import { Link, NavLink, useLocation } from 'react-router-dom';

type NavbarProps = {
	eula: boolean
}

export default function Navbar(props: NavbarProps) {
	return (
		<header className="navbar bg-primary navbar-dark sticky-top navbar-expand">
			<nav className="container text-light">
				<Link className="navbar-brand" to="/" state={{ eula: props.eula }}>IOLCalculator.com</Link>
				<div className="navbar-collapse">
					<ul className="navbar-nav ms-auto">
						<li className="nav-item calc">
							<NavLink className="nav-link" to="/" state={{ eula: props.eula }} >Calculator</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className={`nav-link${/^\/(PrintPreview)?$/i.test(useLocation().pathname) ? '' : ' active'}`} to="/Documentation" state={{ eula: props.eula }}><span className="docs">Docs</span><span className="documentation">Documentation</span><span className="research"> & Research</span></NavLink>
						</li>
					</ul>
				</div>
			</nav>
		</header>
	);
}
