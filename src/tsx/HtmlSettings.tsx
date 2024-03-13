import Settings, { PreopVariableName } from '../api/Settings';

const HtmlSettings = {
	formulaName: <>{Settings.formulaName}</>,

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
