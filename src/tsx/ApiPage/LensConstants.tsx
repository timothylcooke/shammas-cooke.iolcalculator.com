import Settings from '../../api/Settings';

export default function LensConstants() {
	return (
		<tr>
			<td><code>AConstant</code></td>
			<td>Required</td>
			<td>
				<p>The A-constant of the specified IOL. This must be a number between {Settings.iolConstants.AConstant.min} and {Settings.iolConstants.AConstant.max}, and is rounded to the nearest 10<sup>-{Settings.iolConstants.AConstant.roundedToSigFigs}</sup>.</p>
				<p><strong>Important:</strong> All eyes being calculated must use the same A-constant.</p>
			</td>
		</tr>
	);
}
