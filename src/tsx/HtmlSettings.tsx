import Settings, { IolConstantName, PreopVariableName } from '../api/Settings';
import { SelectableIol } from './HomePage';

export type ValidationInfo = {
	warnIfLessThan: number,
	warnIfGreaterThan: number,
	units: string | undefined,
	unitsAbbreviation: string | undefined,
	tooLowWord?: string,
	tooHighWord?: string,
	tooLowWarning?: string,
	tooHighWarning?: string
};

const kWarning: ValidationInfo = {
	warnIfLessThan: 39,
	warnIfGreaterThan: 46,
	tooLowWord: 'flat',
	tooHighWord: 'steep',
	units: 'Diopters',
	unitsAbbreviation: 'D',
};

export const kToR: (kIndex: number, k: number) => number = (kIndex, k) => {
	return (kIndex - 1) * 1000 / k;
};

export const rWarning: (kIndex: number) => ValidationInfo = kIndex => ({
	warnIfLessThan: kToR(kIndex, kWarning.warnIfGreaterThan),
	warnIfGreaterThan: kToR(kIndex, kWarning.warnIfLessThan),
	tooLowWord: kWarning.tooHighWord,
	tooHighWord: kWarning.tooLowWord,
	units: 'millimeters',
	unitsAbbreviation: 'mm'
});

const wtwWarning: ValidationInfo = {
	warnIfLessThan: 10.5,
	warnIfGreaterThan: 13.33,
	tooLowWord: 'small',
	tooHighWord: 'big',
	units: 'millimeters',
	unitsAbbreviation: 'mm'
};

const iols: Array<SelectableIol> = [
	{ name: 'Other', aConstant: null },
	{ name: 'Other IOL with Quarter-Diopter powers', aConstant: null, powers: [{ From: Settings.iolPower.min, To: Settings.iolPower.max, By: 0.25 }] },

	{ name: 'Alcon SA60WF/SN60WF', aConstant: 119, powers: [{ From: 6, To: 30, By: 0.5 }] },
	{ name: 'Alcon SA60AT/SN60AT', aConstant: 118.74, powers: [{ From: 6, To: 30, By: 0.5 }, { From: 31, To: 40, By: 1 }] },
	{ name: 'Alcon MA60MA/MN60MA', aConstant: 118, powers: [{ From: -5, To: 5, By: 1 }] },
	{ name: 'Alcon PanOptix TFNT*0', aConstant: 119.21, powers: [{ From: 6, To: 30, By: 0.5 }, { From: 31, To: 34, By: 1 }] },
	{ name: 'Alcon Vivity CNWET*', aConstant: 119.16, powers: [{ From: 10, To: 30, By: 0.5 }] },

	{ name: 'B&L Envista Enhanced MX60T/MX60E', aConstant: 119.1, powers: [{From: 0, To: 10, By: 1 }, { From: 10.5, To: 30, By: 0.5 }, { From: 31, To: 34, By: 1 }] },
	{ name: 'B&L Envista MX60', aConstant: 119.1, powers: [{From: 0, To: 10, By: 1 }, { From: 10.5, To: 30, By: 0.5 }, { From: 31, To: 34, By: 1 }] },
	{ name: 'B&L LI61AO', aConstant: 119.1, powers: [{ From: 0, To: 5, By: 1 }, { From: 5.5, To: 30, By: 0.5 }, { From: 31, To: 34, By: 1 }] },

	{ name: 'J&J Tecnis 3-Piece (ZA9003)', aConstant: 119.1, powers: [{ From: 10, To: 30, By: 0.5 }] },
	{ name: 'J&J Tecnis 3-Piece (Z9002)', aConstant: 118.8, powers: [{ From: 6, To: 30, By: 0.5 }] },
	{ name: 'J&J Tecnis 1-Piece (ZCB00, ICB00, ZCU***, ZXR00)', aConstant: 119.3, powers: [{ From: 5, To: 34, By: 0.5 }] },
	{ name: 'J&J Sensar AAB00', aConstant: 119.0, powers: [{ From: 6, To: 30, By: 0.5 }] },

	{ name: 'Zeiss CT SPHERIS 204', aConstant: 118.3, powers: [{ From: -10, To: 10, By: 1 }, { From: 10.5, To: 30, By: 0.5 }, { From: 31, To: 45, By: 1 }] },
	{ name: 'Zeiss CT SPHERIS 209M', aConstant: 118.3, powers: [{ From: 0, To: 10, By: 1 }, { From: 10.5, To: 30, By: 0.5 }, { From: 31, To: 32, By: 1 }] },
	{ name: 'Zeiss CT ASPHINA 409M/409MP', aConstant: 118.34, powers: [{ From: 0, To: 10, By: 1 }, { From: 10.5, To: 30, By: 0.5 }, { From: 31, To: 32, By: 1 }] },
	{ name: 'Zeiss CT ASPHINA 509M/509MP', aConstant: 117.84, powers: [{ From: 0, To: 10, By: 1 }, { From: 10.5, To: 30, By: 0.5 }, { From: 31, To: 32, By: 1 }] },
	{ name: 'Zeiss AT LISA tri 839MP', aConstant: 118.6, powers: [{ From: 0, To: 32, By: 0.5 }] },
	{ name: 'Zeiss AT LISA tri toric 939MP', aConstant: 118.8, powers: [{ From: -9.5, To: 30, By: 0.25 }] },
	{ name: 'Zeiss AT TORBI 709M/709MP', aConstant: 118.3, powers: [{ From: -9.5, To: 38, By: 0.25 }] },
	{ name: 'Zeiss AT LARA 829MP', aConstant: 118.5, powers: [{ From: -10, To: 32, By: 0.5 }] },
	{ name: 'Zeiss AT LARA toric 929M/929MP', aConstant: 118.5, powers: [{ From: -3.5, To: 38, By: 0.25 }] }
];

const HtmlSettings = {
	formulaName: <>{Settings.formulaName}</>,

	kIndex: {
		default: 1.3375,
		options: [1.3315, 1.332, 1.336, 1.3375, 1.338],
	},

	iols: iols,

	validationInfo: {
		TgtRx: {
			warnIfLessThan: -2,
			warnIfGreaterThan: 1,
			tooLowWarning: 'Do you really intend to shoot for such a myopic refraction?',
			tooHighWarning: 'Do you really intend to shoot for such a hyperopic refraction?',
			units: 'Diopters',
			unitsAbbreviation: 'D',
		},
		AConstant: {
			warnIfLessThan: 115,
			warnIfGreaterThan: 120,
			tooLowWord: 'low',
			tooHighWord: 'high',
			units: undefined,
			unitsAbbreviation: undefined,
		},
		AL: {
			warnIfLessThan: 19.74,
			warnIfGreaterThan: 28.19,
			tooLowWord: 'short',
			tooHighWord: 'long',
			units: 'millimeters',
			unitsAbbreviation: 'mm'
		},
		ACD: {
			warnIfLessThan: 1.6,
			warnIfGreaterThan: 4.97,
			tooLowWord: 'small',
			tooHighWord: 'big',
			units: 'millimeters',
			unitsAbbreviation: 'mm'
		},
		CCT: {
			warnIfLessThan: 430,
			warnIfGreaterThan: 670,
			tooLowWord: 'short',
			tooHighWord: 'long',
			units: 'millimeters',
			unitsAbbreviation: 'mm'
		},
		LT: {
			warnIfLessThan: 3.24,
			warnIfGreaterThan: 5.99,
			tooLowWord: 'short',
			tooHighWord: 'long',
			units: 'millimeters',
			unitsAbbreviation: 'mm'
		},
		K1: kWarning,
		K2: kWarning,
		WTW: wtwWarning,
		CD: wtwWarning,
	} as
	{ [key in PreopVariableName]: ValidationInfo } &
	{ [key in IolConstantName]: ValidationInfo } &
	{ TgtRx: ValidationInfo },

	useKsByDefault: true, // true to use "K1/K2" by default; false to use "R1/R2"

	variableDescriptions: {
		K1: (isPreop: boolean) => <p>One {isPreop ? '' : 'preoperative '}meridian specified by the keratometer. This can be the steep K, or the flat K. Keratometry values must be between {Settings.variables.K1?.min} and {Settings.variables.K1?.max} Diopters, and you must specify the <a href="#k-index">keratometric index</a> in the request.</p>,
		K2: (isPreop: boolean) => <p>The second {isPreop ? '' : 'preoperative '}meridian specified by the keratometer. This can be the steep K, or the flat K. Keratometry values must be between {Settings.variables.K2?.min} and {Settings.variables.K2?.max} Diopters, and you must specify the <a href="#k-index">keratometric index</a> in the request.</p>,
		AL: (isPreop: boolean) => <p>The {isPreop ? '' : 'preoperative '}axial length, measured by optical biometry. This value must be between {Settings.variables.AL?.min} and {Settings.variables.AL?.max} millimeters.</p>,
		CCT: (isPreop: boolean) => <p>The {isPreop ? '' : 'preoperative '}central corneal thickness, measured by optical biometry. This value must be between {Settings.variables.CCT?.min} and {Settings.variables.CCT?.max} microns.</p>,
		ACD: (isPreop: boolean) => <p>The {isPreop ? '' : 'preoperative '}anterior chamber depth, measured by optical biometry. This value is the sum of the central corneal thickness and the aqueous depth, and must be between {Settings.variables.ACD?.min} and {Settings.variables.ACD?.max} millimeters.</p>,
		LT: (isPreop: boolean) => <p>The {isPreop ? '' : 'preoperative '}lens thickness, measured by optical biometry. This value must be between {Settings.variables.LT?.min} and {Settings.variables.LT?.max} millimeters.</p>,
		WTW: (isPreop: boolean) => <p>The {isPreop ? '' : 'preoperative '}horizontal white-to-white, also known as &quot;Horizontal Corneal Diameter.&quot; This value must be between {Settings.variables.WTW?.min} and {Settings.variables.WTW?.max} millimeters.</p>,
		CD: (isPreop: boolean) => <p>The {isPreop ? '' : 'preoperative '}horizontal corneal diameter, also known as &quot;Horizontal White-to-White.&quot; This value must be between {Settings.variables.CD?.min} and {Settings.variables.CD?.max} millimeters.</p>,
	} as { [key in PreopVariableName]: (isPreop: boolean) => JSX.Element }
};

export default HtmlSettings;
