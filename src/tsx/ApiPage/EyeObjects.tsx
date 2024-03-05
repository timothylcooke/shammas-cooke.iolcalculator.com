import Settings, { PreopVariable } from '../../api/Settings';
import HtmlSettings from '../HtmlSettings';
import { PageProps } from './ApiPageProps';

export default function EyeObjects(props: PageProps) {
	const firstVariable = props.page === 'preop' ?
		<tr>
			<td><abbr title="Target Refraction"><code id="tgt-rx">TgtRx</code></abbr></td>
			<td>Required</td>
			<td><p>The target refraction, or desired post-operative spherical equivalent refraction. This must be a number between {Settings.tgtRx.min} and +{Settings.tgtRx.max} Diopters.</p></td>
		</tr> :
		<tr>
			<td><code>IolPower</code></td>
			<td>Required</td>
			<td><p>The power of the IOL implanted into the eye, as marked on the box. This must be a number between {Settings.iolPower.min} and +{Settings.iolPower.max} Diopters.</p></td>
		</tr>;

	// For each key in Settings.variables, add a row.
	const variables = Object.keys(Settings.variables).map(x => ({ name: x as PreopVariable, var: Settings.variables[x as PreopVariable]! })).filter(x => x.var).map((x, i) =>
		<tr key={i}>
			<td>{x.var.fullName === x.name ? x.name : <abbr title={x.var.fullName}>{x.name}</abbr>}</td>
			<td>{x.var.usage}{x.var.usageAsterisk ? <abbr title={x.var.usageAsterisk}>*</abbr> : undefined}</td>
			<td>{HtmlSettings.variableDescriptions[x.name](props.page === 'preop')}</td>
		</tr>
	);

	return (
		<>
			<h1 id="eyes" className="display-4">Eye Objects</h1>
			<p className="lead">Each eye you specify must include the following parameters:</p>
			<table className="table">
				<thead>
					<tr>
						<th scope="col">Name</th>
						<th scope="col">Usage</th>
						<th scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
					{firstVariable}
					{variables}
				</tbody>
			</table>
		</>
	);
}
