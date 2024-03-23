import { BaseProps } from './BaseProps';
import { IolPowers, PreopApiOutput } from '../api/IolFormula/ApiTypes';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useState, useRef, SyntheticEvent } from 'react';
import { Button, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import HtmlSettings from './HtmlSettings';
import EyeCard, { EyeCardHandle } from './EyeCard';
import { useNavigate } from 'react-router-dom';

export type SelectableIol = {
	name: string,
	aConstant: number | null,
	powers?: Array<IolPowers>
}

export type EyeHistoryState = {
	tgtRx: number,
	iol: SelectableIol,
	aConstant: number,
	k1: number,
	k2: number,
	al: number
}

export type HistoryState = {
	last: string,
	first: string,
	dob: string,
	surgeon: string,
	kIndex: number,
	useKs: boolean,
	od: EyeHistoryState,
	os: EyeHistoryState,
	fatalError: string | undefined,
	apiResponse: PreopApiOutput | undefined
};

export default function HomePage(props: BaseProps) {
	const historyState: HistoryState = window.history.state?.usr?.state;

	const newNamePopover = (id: string) => <Popover id={id}>
		<Popover.Header>
			<strong>Worried about privacy?</strong>
		</Popover.Header>
		<Popover.Body>
			Name and DOB are only used for printing. We never send them outside your browser.
		</Popover.Body>
	</Popover>;

	const [lastName, setLastName] = useState(historyState?.last ?? '');
	const [firstName, setFirstName] = useState(historyState?.first ?? '');
	const [dob, setDOB] = useState(historyState?.dob ?? '');
	const [surgeon, setSurgeon] = useState(historyState?.surgeon ?? '');
	const [kIndex, setKIndex] = useState(historyState?.kIndex ?? HtmlSettings.kIndex.default);
	const [useKs, setUseKs] = useState(historyState?.useKs ?? HtmlSettings.useKsByDefault);
	const [lastNameError, setLastNameError] = useState(undefined as string | undefined);
	const [kIndexError, setKIndexError] = useState(undefined as string | undefined);
	const [showOneEyeRequired, setShowOneEyeRequired] = useState(false);
	const od = useRef<EyeCardHandle>(null);
	const os = useRef<EyeCardHandle>(null);

	const validateLastName = (newValue?: string) => {
		if (newValue !== undefined) {
			setLastName(newValue);
		}

		newValue ??= lastName;

		const error = newValue ? undefined : 'Last name is required';
		setLastNameError(error);
		return error;
	};

	const validateKIndex = (newValue?: number) => {
		if (newValue !== undefined) {
			setKIndex(newValue);
		}

		newValue ??= kIndex;

		const error = newValue ? (newValue < 1 || newValue > 2 ? 'Keratometric Index must be between 1 and 2' : undefined) : 'Keratometric Index is required';
		setKIndexError(error);
		return error;
	};

	const navigate = useNavigate();

	const onContinue = (e: SyntheticEvent<EventTarget>) => {
		e.preventDefault();

		const odValidation = od.current!.validate();
		const osValidation = os.current!.validate();

		const errorElements = [
			validateLastName() ? 'last-name' : undefined,
			validateKIndex() ? 'k-index' : undefined,
			odValidation,
			osValidation,
		];

		const firstError = errorElements.find(x => typeof x === 'string') as string;

		if (firstError) {
			document.getElementById(firstError)?.focus();
			return;
		}

		if (typeof odValidation === 'undefined' && typeof osValidation === 'undefined') {
			document.getElementById('submit')?.focus();
			setShowOneEyeRequired(true);
			return;
		}

		const state: HistoryState = {
			last: lastName,
			first: firstName,
			dob,
			surgeon,
			kIndex,
			useKs,
			od: odValidation as EyeHistoryState,
			os: osValidation as EyeHistoryState,
			fatalError: undefined,
			apiResponse: undefined
		};

		// Edit the current history so that if we navigate back to this page, we keep our inputs.
		// eslint-disable-next-line  @typescript-eslint/no-explicit-any
		const newState = {} as any;
		Object.assign(newState, window.history.state);
		newState.usr.state = state;
		window.history.replaceState(newState, '', window.location.pathname);

		navigate('/PrintPreview', { state: { state, eula: props.eula } });
	};

	return (
		<form className="container py-4">
			<div className="row">
				<h1 id="bd-title">IOLCalculator.com</h1>
			</div>
			<div className="row">
				<p className="lead">This is an example website and API page showcasing how to set up a website with a functional IOL calculator API.</p>
			</div>
			<div className="row">
				<p>This site has a working implementation of an IOL calculator and API a for the T2 formula. <a href="https://github.com/timothylcooke/iolcalculator.com">All of the code for this website can be found on GitHub.</a></p>
			</div>
			<div className="row justify-content-center mt-4">
				<div className="col">
					<div className="card mx-auto px-0">
						<h3 className="card-header text-center">Patient</h3>
						<div className="card-body pt-0 pb-4">
							<OverlayTrigger trigger="focus" placement="bottom" overlay={newNamePopover('name-1')}>
								<div className="row">
									<div className="col-sm pt-4">
										<TextField id="last-name" fullWidth label="Last Name" error={lastNameError !== undefined} helperText={lastNameError} value={lastName} onChange={e => validateLastName(e.target.value)} onBlur={() => validateLastName()} placeholder="(Required)" />
									</div>
									<div className="col-sm pt-4">
										<TextField fullWidth label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="(Optional)" />
									</div>
								</div>
							</OverlayTrigger>
							<div className="row">
								<OverlayTrigger trigger="focus" placement="bottom" overlay={newNamePopover('name-2')}>
									<div className="col-sm pt-4">
										<TextField fullWidth label="Date of Birth" value={dob} onChange={e => setDOB(e.target.value)} placeholder="(Optional)" />
									</div>
								</OverlayTrigger>
								<div className="col-sm pt-4">
									<TextField fullWidth label="Surgeon" value={surgeon} onChange={e => setSurgeon(e.target.value)} placeholder="(Optional)" />
								</div>
							</div>
							<div className="row">
								<div className="col-sm pt-4">
									<FormControl fullWidth>
										<InputLabel id="k-index-label" error={kIndexError !== undefined}>Keratometric Index</InputLabel>
										<Select id="k-index" labelId='k-index-label' value={kIndex} onChange={e => validateKIndex(e.target.value as number)} label="Keratometric Index" error={kIndexError !== undefined} onBlur={() => validateKIndex()}>
											{HtmlSettings.kIndex.options.map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)}
										</Select>
										<FormHelperText error={kIndexError !== undefined}>{kIndexError}</FormHelperText>
									</FormControl>
								</div>
								<div className="col-sm pt-4 text-center">
									<FormControlLabel control={<Switch checked={useKs} onChange={e => setUseKs(e.target.checked)} />} label={useKs ? 'Use Ks' : 'Use Rs'}  />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='row'>
				<EyeCard ref={od} title="OD - Right" idPrefix="od" historyState={historyState?.od} useKs={useKs} kIndex={kIndex ?? HtmlSettings.kIndex.default} />
				<EyeCard ref={os} title="OS - Left" idPrefix="os" historyState={historyState?.os} useKs={useKs} kIndex={kIndex ?? HtmlSettings.kIndex.default} />
			</div>

			<div className="row justify-content-center">
				<div className='col pt-4 text-center'>
					<OverlayTrigger placement="top" show={showOneEyeRequired} overlay={<Popover><Popover.Header><strong>Missing Data</strong></Popover.Header><Popover.Body>You must enter at least one eye.</Popover.Body></Popover>}>
						<Button type="submit" id="submit" variant="contained" onClick={onContinue} onBlur={() => setShowOneEyeRequired(false)}>Continue</Button>
					</OverlayTrigger>
				</div>
			</div>
		</form>
	);
}
