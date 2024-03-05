type Variable = {
	min: number,
	max: number,
	usage: 'Required' | 'Recommended' | 'Optional',
	usageAsterisk?: string,
	fullName: string
}

export type PreopVariable = 'AL' | 'K1' | 'K2' | 'ACD' | 'CCT' | 'LT' | 'WTW' | 'CD';

const Settings = {
	formulaName: 'T2',
	apiUrl: '/api/v1/t2',

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
		aConstant: {
			variableName: 'AConstant',
			min: 101,
			max: 129,
			roundedToSigFigs: 5
		},
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
		max: 1000
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

		/*
		TODO:
			Additional variables are not used by the T2 variable.
			Uncomment any variables you need in your formula.
		*/
		// ACD: {
		// 	min: 1.1,
		// 	max: 5.9,
		// 	usage: 'Recommended',
		// 	fullName: 'Anterior Chamber Depth'
		// },

		// CCT: {
		// 	min: 310,
		// 	max: 800,
		// 	usage: 'Recommended',
		// 	fullName: 'Central Corneal Thickness'
		// },

		// LT: {
		// 	min: 2.52,
		// 	max: 6.47,
		// 	usage: 'Recommended',
		// 	usageAsterisk: 'LT is required for the Argos biometer, or to calculate lens powers greater than +40 Diopters',
		// 	fullName: 'Lens Thickness'
		// },

		// // You can safely rename "WTW" to "CD"
		// WTW: {
		// 	min: 9.81,
		// 	max: 13.5,
		// 	usage: 'Optional',
		// 	usageAsterisk: 'WTW is required to calculate lens powers greater than +40 Diopters',
		// 	fullName: 'Horizontal Corneal Diamter'
		// },

		// CD: {
		// 	min: 9.81,
		// 	max: 13.5,
		// 	usage: 'Optional',
		// 	usageAsterisk: 'CD is required to calculate lens powers greater than +40 Diopters',
		// 	fullName: 'Horizontal Corneal Diameter'
		// },
	} as { [key in PreopVariable]: Variable | undefined }
};

export default Settings;
