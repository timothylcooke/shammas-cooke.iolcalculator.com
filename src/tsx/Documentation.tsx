import Settings from '../api/Settings';
import { Link } from 'react-router-dom';

type DocumentationProps = {
	eula: boolean
}

export default function Documentation(props: DocumentationProps) {
	return (
		<div className="container py-5">
			<div className="row">
				<h1 id="bd-title">Documentation & Research</h1>
			</div>
			<div className="row">
				<p className="lead">APIs</p>
			</div>
			<div className="row">
				<p>Do you want to include the {Settings.formulaName} formula within your own IOL calculator? Are you hoping to use the {Settings.formulaName} formula within your own code?</p>
			</div>
			<div className="row">
				<div className="col-lg-4 col-md-6">
					<Link className="btn btn-primary d-block mb-4" to={Settings.apiUrl} state={{ eula: props.eula }} role="button">Check out our API documentation</Link>
				</div>
			</div>
		</div>
	);
}
