type Variable = {
	min: number,
	max: number,
	usage: 'Required' | 'Recommended' | 'Optional',
	usageAsterisk?: string,
	fullName: string
}

export type LensConstant = {
	min: number,
	max: number,
	roundedToSigFigs?: number
};

// You can delete variable names that aren't used, but you'll also have to delete them in HtmlSettings' VariableDescriptions.
export const PreopVariableNames = ['AL', 'K1', 'K2'] as const;
export type PreopVariableName = typeof PreopVariableNames[number];

// Each constant must be defined in Settings.iolConstants with a min and max value.
export const IolConstantNames = ['AConstant'] as const;
export type IolConstantName = typeof IolConstantNames[number];

export type IolConstantValues = {
	[key in IolConstantName]: number
};

const Settings = {
	formulaName: 'Shammas-Cooke',
	apiUrl: '/api/v1/shammas-cooke', // This should not end with a trailing slash.

	// We convert Ks specified by the user to Ks with this keratometric refractive index.
	convertKIndex: 1.3375,

	// Any user-facing predicted refraction should be rounded to how many significant figures?
	roundAnswerSigFigs: 4,

	// If you change which IOL constants are used, you must update the tsx/ApiPage/LensConstants.tsx file.
	iolConstants: {
		// The display name of the IOL constant whose value we change in order to optimize the constant(s)
		constantToOptimizeDisplayName: 'A-Constant',

		// The variable name of the IOL constant whose value we change in order to optimize the constant(s)
		constantToOptimizeVariableName: 'AConstant',

		// Each lens constant must specify each of the following:
		// - variableName: The name of the lens constant as specified in the API
		// - min: The minimum value allowed
		// - max: The maximum value allowed
		// - roundedToSigFigs: When we optimize the lens constant, how many significant figures we should round the lens constant to.
		//                     You can safely omit roundedToSigFigs if we don't change that lens constant when optimizing IOL constant(s).
		AConstant: {
			min: 101,
			max: 129,
			roundedToSigFigs: 5
		}
	} as {
		[key in IolConstantName]: LensConstant
	} & {
		constantToOptimizeDisplayName: string,
		constantToOptimizeVariableName: IolConstantName
	},

	optimizeEyes: {
		// We will not optimize your lens constant unless you supply 50 eyes.
		minEyes: 50,

		// Ideally, you would have at least 100 eyes before optimizing a lens constant.
		idealMinEyes: 100,

		// We only iterate up to 20 times when computing a personalized lens constant.1
		maxIterations: 20,

		// Once the MPE is less than 10^-5, we consider the lens constant optimized.
		mpeSigFigs: 5,
	},

	kIndex: {
		min: 1,
		max: 2
	},

	v: {
		min: 10,
		max: 20
	},

	iolPower: {
		min: -20,
		max: +80
	},

	tgtRx: {
		min: -15,
		max: +30
	},

	iolsPerEye: {
		min: 1,
		max: 100
	},

	postopEyes: {
		min: 1,
		max: 10000
	},

	predictionsPerIol: {
		min: 1,
		max: 21
	},

	preopEyes: {
		min: 1,
		max: 100
	},

	variables: {
		K1: {
			min: 32,
			max: 57,
			usage: 'Required',
			fullName: 'K1'
		},

		K2: {
			min: 32,
			max: 57,
			usage: 'Required',
			fullName: 'K2'
		},

		AL: {
			min: 13,
			max: 40,
			usage: 'Required',
			fullName: 'Axial Length'
		},

	} as { [key in PreopVariableName]: Variable | undefined }
};

export default Settings;
