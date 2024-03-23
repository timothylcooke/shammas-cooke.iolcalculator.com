import Settings from '../api/Settings';
import { Link } from 'react-router-dom';
import HtmlSettings from './HtmlSettings';
import { BaseProps } from './BaseProps';

export default function ApiDocs(props: BaseProps) {
	return (
		<div className="container py-5">
			<div className="row">
				<h1 id="bd-title">{HtmlSettings.formulaName} API Documentation</h1>
			</div>

			<div className="row">
				<p className="lead">There are two separate APIs.</p>
			</div>
			<div className="row">
				<div className="col-md-6">
					The preoperative API is designed to let you use the {HtmlSettings.formulaName} formula in your own IOL calculator.
					<Link className="btn btn-primary d-block mb-4" to={`${Settings.apiUrl}/preop`} role="button" state={{ eula: props.eula }}>{HtmlSettings.formulaName} Preoperative API</Link>
				</div>
				<div className="col-md-6">
					The postoperative API is designed to let you optimize your lens constants.
					<Link className="btn btn-primary d-block mb-4" to={`${Settings.apiUrl}/postop`} role="button" state={{ eula: props.eula }}>{HtmlSettings.formulaName} Postoperative API</Link>
				</div>
			</div>
		</div>
	);
}
