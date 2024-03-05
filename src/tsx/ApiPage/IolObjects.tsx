import Settings from '../../api/Settings';
import LensConstants from './LensConstants';

export default function IolObjects() {
	return (
		<>
			<h1 id="iols" className="display-4">IOL Objects</h1>
			<p className="lead">Each IOL you specify must include two properties:</p>

			<table className="table">
				<thead>
					<tr>
						<th scope="col">Name</th>
						<th scope="col">Usage</th>
						<th scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
					<LensConstants />
					<tr>
						<td><code>Powers</code></td>
						<td>Optional</td>
						<td>
							<p>The list of available IOL powers for the specified IOL. If specified, this must be a list of IOL power ranges. Each range must include three required parameters: <code>From</code>, <code>To</code>, and <code>By</code>.</p>
							<p>For example, the PanOptix IOL should specify:</p>
							<pre className="bg-light px-1 py-2">
								<code>
									{`"Powers": ${JSON.stringify([{ From: 6, To: 30, By: 0.5 },{ From: 31, To: 34, By: 1 }], null, 4)}`}
								</code>
							</pre>
							<p>If <code>Powers</code> are not specified, then the default value will be used:</p>
							<pre className="bg-light px-1 py-2">
								<code>
									{`"Powers": ${JSON.stringify([{ From: Settings.iolPower.min, To: 0, By: 1 }, { From: 0, To: 34, By: 0.5 }, { From: 34, To: Settings.iolPower.max, By: 1 }], null, 4)}`}
								</code>
							</pre>
						</td>
					</tr>
				</tbody>
			</table>
		</>
	);
}
