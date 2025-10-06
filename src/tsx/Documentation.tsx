import Settings from '../api/Settings';
import { Link } from 'react-router-dom';
import { BaseProps } from './BaseProps';
import { Button } from '@mui/material';

export default function Documentation(props: BaseProps) {
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
				<div className="col-md-6">
					<Button className="mb-4" fullWidth component={Link} to={Settings.apiUrl} state={{ eula: props.eula }} variant="contained">Check out our API documentation</Button>
				</div>
			</div>
		</div>
	);
}
