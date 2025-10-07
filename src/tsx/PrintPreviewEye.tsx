import { PreopApiError, PreopApiIols, PreopApiPredictions } from '../api/IolFormula/ApiTypes';
import { EyeHistoryState } from './HomePage';
import HtmlSettings, { rWarning, kToR } from './HtmlSettings';

type PrintPreviewEyeProps = {
	label: string,
	useKs: boolean,
	kIndex: number,
	isQuerying: boolean,
	data: EyeHistoryState,
	predictions: PreopApiError | PreopApiIols | undefined
};

export default function PrintPreviewEye(props: PrintPreviewEyeProps) {
	if (typeof props.data === 'undefined') {
		return <td><table className="variables" /></td>;
	}

	const predictions: PreopApiError | PreopApiPredictions | undefined = typeof props.predictions === 'undefined' ? undefined : (props.predictions as PreopApiError).Error ? props.predictions as PreopApiError : (props.predictions as PreopApiIols).IOLs[0];

	return (
		<td>
			<table className="mt-3 variables">
				<tbody>
					<tr>
						<th colSpan={3}>
							<h3 className="text-center">{props.label}</h3>
							<svg fill="#007bff">
								<path d="M0,0h275v1H0" />
							</svg>
						</th>
					</tr>
					<tr>
						<td>Target Refraction{HtmlSettings.validationInfo.TgtRx.unitsAbbreviation ? ` (${HtmlSettings.validationInfo.TgtRx.unitsAbbreviation})` : ''}</td>
						<td className="text-end">{props.data!.tgtRx}</td>
					</tr>
					<tr>
						<td>A-Constant{HtmlSettings.validationInfo.AConstant.unitsAbbreviation ? ` (${HtmlSettings.validationInfo.AConstant.unitsAbbreviation})` : ''}</td>
						<td className="text-end">{props.data!.aConstant}</td>
					</tr>
					<tr>
						<td>Axial Length{HtmlSettings.validationInfo.AL.unitsAbbreviation ? ` (${HtmlSettings.validationInfo.AL.unitsAbbreviation})` : ''}</td>
						<td className="text-end">{props.data!.al}</td>
					</tr>
					<tr>
						<td>{props.useKs ? 'K1' : 'R1'}{props.useKs ? (HtmlSettings.validationInfo.K1.unitsAbbreviation ? ` (${HtmlSettings.validationInfo.K1.unitsAbbreviation})` : '') : (rWarning(1).unitsAbbreviation ? ` (${rWarning(1).unitsAbbreviation})` : '')}</td>
						<td className="text-end">{props.useKs ? props.data!.k1 : kToR(props.kIndex, props.data!.k1)}</td>
					</tr>
					<tr>
						<td>{props.useKs ? 'K2' : 'R2'}{props.useKs ? (HtmlSettings.validationInfo.K2.unitsAbbreviation ? ` (${HtmlSettings.validationInfo.K2.unitsAbbreviation})` : '') : (rWarning(1).unitsAbbreviation ? ` (${rWarning(1).unitsAbbreviation})` : '')}</td>
						<td className="text-end">{props.useKs ? props.data!.k2 : kToR(props.kIndex, props.data!.k2)}</td>
					</tr>
				</tbody>
			</table>
			<table className="mt-3 mx-auto predictions">
				<tbody>
					<tr>
						<td className="text-primary" colSpan={3}>{props.data!.iol.name}</td>
					</tr>
					{(props.isQuerying ? <tr>
						<td colSpan={3}>
							<div className="spinner-border text-primary mt-3 mx-auto" role="status" />
						</td>
					</tr> : null)}
					{(typeof predictions === 'undefined' ? null :
						typeof (predictions as PreopApiError).Error === 'string' ? [<tr key={0}><td colSpan={3} className="text-danger">{(predictions as PreopApiError).Error}</td></tr>] :
							((predictions as PreopApiPredictions).Predictions!.map((x, i) => <tr key={i}>
								<td className={`text-primary${(x.IsBestOption === true ? ' best-option' : '')}${(i === 0 ? ' pt-1' : '')}`}>{`${x.IOL < 0 ? '(minus) ' : ''}${x.IOL.toFixed(2)}`}</td>
								<td className="middle">&nbsp;</td>
								<td className={`${(x.IsBestOption === true ? ' best-option' : '')}${(i === 0 ? ' pt-1' : '')}`}>{x.Rx.toFixed(2)}</td>
							</tr>))
					)}
				</tbody>
			</table>
		</td>
	);
}
