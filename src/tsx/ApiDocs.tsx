import Settings from '../api/Settings';
import { Link } from 'react-router-dom';
import HtmlSettings from './HtmlSettings';
import { BaseProps } from './BaseProps';
import { Button } from '@mui/material';

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
					<Button component={Link} to={`${Settings.apiUrl}/preop`} state={{ eula: props.eula }} variant="contained" className="mb-4" fullWidth>{HtmlSettings.formulaName} Preoperative API</Button>
				</div>
				<div className="col-md-6">
					The postoperative API is designed to let you optimize your lens constants.
					<Button component={Link} to={`${Settings.apiUrl}/postop`} state={{ eula: props.eula }} variant="contained" className="mb-4" fullWidth>{HtmlSettings.formulaName} Postoperative API</Button>
				</div>
			</div>
		</div>
	);
}
