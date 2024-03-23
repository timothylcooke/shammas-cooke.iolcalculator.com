import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { EyeHistoryState, SelectableIol } from './HomePage';
import NumberTextBox, { NumberTextBoxHandle } from './NumberTextBox';
import Settings from '../api/Settings';
import HtmlSettings, { rWarning, kToR } from './HtmlSettings';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';

export type EyeCardHandle = {
	validate: () => EyeHistoryState | undefined | string,
};

type EyeCardProps = {
	title: string,
	historyState: EyeHistoryState | undefined,
	useKs: boolean,
	kIndex: number,
	idPrefix: 'od' | 'os',
};

const EyeCard = forwardRef<EyeCardHandle, EyeCardProps>(function EyeCard(props, ref) {
	const [aConstant, setAConstant] = useState(Number.isNaN(Number(props.historyState?.aConstant)) ? '' : Number(props.historyState?.aConstant).toString());
	const [tgtRx, setTgtRx] = useState(Number.isNaN(Number(props.historyState?.tgtRx)) ? '' : Number(props.historyState?.tgtRx).toString());
	const [k1, setK1] = useState(Number.isNaN(Number(props.historyState?.k1)) ? '' : (props.useKs ? Number(props.historyState?.k1) : kToR(props.kIndex, Number(props.historyState?.k1))).toString());
	const [k2, setK2] = useState(Number.isNaN(Number(props.historyState?.k2)) ? '' : (props.useKs ? Number(props.historyState?.k2) : kToR(props.kIndex, Number(props.historyState?.k2))).toString());
	const [al, setAL] = useState(Number.isNaN(Number(props.historyState?.al)) ? '' : Number(props.historyState?.al).toString());
	const [iol, setIol] = useState(props.historyState?.iol ? JSON.stringify(props.historyState.iol) : '');
	const [iolError, setIolError] = useState(undefined as string | undefined);

	const aConstantRef = useRef<NumberTextBoxHandle>(null);
	const tgtRxRef = useRef<NumberTextBoxHandle>(null);
	const k1Ref = useRef<NumberTextBoxHandle>(null);
	const k2Ref = useRef<NumberTextBoxHandle>(null);
	const alRef = useRef<NumberTextBoxHandle>(null);

	const required = aConstant || tgtRx || k1 || k2 || al || iol ? true : false;

	const [wasUseKs, setWasUseKs] = useState(props.useKs);

	if (props.useKs !== wasUseKs) {
		setWasUseKs(props.useKs);
		const parsed = {
			k1: k1 ? Number(k1) : Number.NaN,
			k2: k2 ? Number(k2) : Number.NaN
		};

		if (!Number.isNaN(parsed.k1)) {
			setK1(kToR(props.kIndex, parsed.k1).toString());
		}

		if (!Number.isNaN(parsed.k2)) {
			setK2(kToR(props.kIndex, parsed.k2).toString());
		}
	}

	const kLimits = props.useKs ? Settings.variables.K1! : { max: kToR(props.kIndex, Settings.variables.K1!.min), min: kToR(props.kIndex, Settings.variables.K1!.max) };
	const kValidationInfo = props.useKs ? HtmlSettings.validationInfo.K1 : rWarning(props.kIndex);

	const onUpdateIol = (iol: string) => {
		setIol(iol);
		if (iol) {
			const parsed = JSON.parse(iol) as SelectableIol;
			if (parsed && parsed.aConstant && Number(parsed.aConstant)) {
				setAConstant(Number(parsed.aConstant).toString());
			}
		} else {
			setAConstant('');
		}
	};

	const validateIol = () => {
		const error = required && iol === '' ? 'You must specify the IOL' : undefined;
		setIolError(error);
		return error ? `${props.idPrefix}-iol` : undefined;
	};

	useImperativeHandle(ref, () => ({
		validate() {
			const iolError = validateIol();
			const aConstant = aConstantRef.current!.validate();
			const tgtRx = tgtRxRef.current!.validate();
			const k1 = k1Ref.current!.validate();
			const k2 = k2Ref.current!.validate();
			const al = alRef.current!.validate();

			const error = [ iolError, aConstant, tgtRx, k1, k2, al ].find(x => typeof x === 'string') as string;

			if (required) {
				return error || {
					// If there is no error, then we must be a valid EyeHistoryState
					tgtRx: tgtRx as number,
					iol: JSON.parse(iol) as SelectableIol,
					aConstant: aConstant as number,
					k1: props.useKs ? k1 as number : kToR(props.kIndex, k1 as number),
					k2: props.useKs ? k2 as number : kToR(props.kIndex, k2 as number),
					al: al as number
				};
			}

			// No error; no data.
			return undefined;
		},
	}));

	return (
		<div className="col-sm card-deck mt-4">
			<div className="card">
				<h3 className="card-header">{props.title}</h3>
				<div className="card-body pt-0 pb-4">
					<div className="row">
						<div className="col pt-4">
							<FormControl fullWidth>
								<InputLabel id={`${props.idPrefix}-iol-label`} error={iolError !== undefined}>IOL</InputLabel>
								<Select id={`${props.idPrefix}-iol`} labelId={`${props.idPrefix}-iol-label`} value={iol} onChange={e => onUpdateIol(e.target.value)} label="IOL" error={iolError !== undefined} onBlur={validateIol}>
									<MenuItem hidden={iol === ''} value=''><span style={{color: 'red'}}>Clear Selection (No IOL)</span></MenuItem>
									{HtmlSettings.iols.map((x, i) => <MenuItem key={i} value={JSON.stringify(x)}>{x.name}</MenuItem>)}
								</Select>
								<FormHelperText error={iolError !== undefined}>{iolError}</FormHelperText>
							</FormControl>
						</div>
					</div>
					<NumberTextBox ref={aConstantRef} id={`${props.idPrefix}-a-constant`} displayName="A-Constant" limits={Settings.iolConstants.AConstant} validationInfo={HtmlSettings.validationInfo.AConstant} value={aConstant} setValue={setAConstant} required={required} />
					<NumberTextBox ref={tgtRxRef} id={`${props.idPrefix}-tgt-rx`} displayName="Target Refraction" limits={Settings.tgtRx} validationInfo={HtmlSettings.validationInfo.TgtRx} value={tgtRx} setValue={setTgtRx} required={required} />
					<NumberTextBox ref={k1Ref} id={`${props.idPrefix}-k1`} displayName={props.useKs ? 'K1' : 'R1'} limits={kLimits} validationInfo={kValidationInfo} value={k1} setValue={setK1} required={required} />
					<NumberTextBox ref={k2Ref} id={`${props.idPrefix}-k2`} displayName={props.useKs ? 'K2' : 'R2'} limits={kLimits} validationInfo={kValidationInfo} value={k2} setValue={setK2} required={required} />
					<NumberTextBox ref={alRef} id={`${props.idPrefix}-al`} displayName="Axial Length" limits={Settings.variables.AL!} validationInfo={HtmlSettings.validationInfo.AL} value={al} setValue={setAL} required={required} />
				</div>
			</div>
		</div>
	);
});

export default EyeCard;
