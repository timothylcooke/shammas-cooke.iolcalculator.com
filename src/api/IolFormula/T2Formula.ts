import BaseFormula from './BaseFormula';
import { EyeObject, IolObject, IolPowers, IolPropertyNames, PostopApiInputs, PostopApiOutput, PostopEyeObject, PostopFormula, PreopApiOutput, PreopEyeObject, PreopEyeVariableNames } from './ApiVariables';
import Settings, { IolConstantNames, IolConstantValues, PreopVariableNames } from '../Settings';

const enumeratePowers = (powers: Array<IolPowers> | undefined): Array<number> | undefined => {
	if (typeof powers === 'undefined') {
		return undefined;
	}

	const answer: Array<number> = [];

	for (const i in powers) {
		const pow = powers[Number(i)];
		for (let p = pow.From; p <= pow.To; p += pow.By) {
			answer.push(p);
		}
	}

	// Return each power only once.
	return answer.filter((v, i, a) => a.indexOf(v) === i);
};

export default class T2Formula extends BaseFormula {
	constructor(eye: EyeObject, kIndex: number) {
		super(eye, kIndex);
	}


	calculate(iolConstants: IolConstantValues, iolPower: number): string | number {
		// TODO: This is the guts of the formula.
		// Change it as necessary to output the value requested by the user.
		// You can safely return a string (an error that will be shown to the user telling them what is wrong with their inputs)
		// Or you can return a number

		// Basic validation has already been performed.
		// All IOL constants and all eye variables are verified to be within appropriate limits.
		// All required variables are present.

		// If you have a variable that is conditionally required and is absent, you can return a string error.
		// For example, you can do something like this:
		/*
		if (this.variables.AL! > 40 && typeof this.variables.CCT !== 'number') {
			return 'CCT is required if AL is greater than 40 mm';
		}
		*/

		// Keratometry values are already converted to 1.3375 keratometric index (since Settings.convertKIndex = 1.3375)
		// The T2 formula is a general vergence formula.
		// There are basically just three variables: K0, TCP, and ELP
		const aveK = (this.variables.K1! + this.variables.K2!) / 2;
		const k0 = 333 / 337.5 * aveK;
		const elp = -10.32566272 + 0.326300537 * this.variables.AL! + 0.135332269 * aveK + 0.62467 * iolConstants.AConstant - 68.747 - 3.336;
		const al = 0.97971 * this.variables.AL! + 0.65696;

		const vertex = 12;

		return 1000 / (1000 / (1336 / (1336 / (1336 / (al - elp) - iolPower) + elp) - k0) + vertex);
	}


	// The only preoperative variables that are valid are...
	static allValidPreopVariables: Array<string> = 
		// Any that are not variable names,
		PreopEyeVariableNames.filter(x => (PreopVariableNames.concat() as string[]).indexOf(x) < 0)
			// or any variable names explicitly referenced in Settings.variables
			.concat(PreopVariableNames.filter(x => Settings.variables[x]));

	static calculatePreOp(kIndex: number, predictionsPerIol: number, iols: IolObject[] | undefined, eye: PreopEyeObject): PreopApiOutput {
		// Let's start by making sure the values of the eye are all acceptable.
		const invalidProp = Object.keys(eye).find(x => T2Formula.allValidPreopVariables.indexOf(x) < 0);
		if (invalidProp) {
			return {
				Error: `Invalid property: "${invalidProp}"`
			};
		}

		const formula = new T2Formula(eye, kIndex);

		if (formula.error || typeof eye.TgtRx !== 'number' || isNaN(eye.TgtRx) || eye.TgtRx < Settings.tgtRx.min || eye.TgtRx > Settings.tgtRx.max) {
			return {
				Error: formula.error || `TgtRx must be a valid number between ${Settings.tgtRx.min} and +${Settings.tgtRx.max}.`
			};
		}

		iols = eye.IOLs || iols;
		if (!Array.isArray(iols) || iols.length < Settings.iolsPerEye.min || iols.length > Settings.iolsPerEye.max) {
			return {
				Error: `This eye does not have a valid amount of IOLs. You can specify default IOLs in the root "IOLs" property, and you can override it within individual eyes. You must specify between ${Settings.iolsPerEye.min} and ${Settings.iolsPerEye.max} IOLs.`
			};
		}

		return {
			IOLs: iols.map(iol => {
				const invalidProp = Object.keys(iol).find(x => (IolPropertyNames as Array<string>).indexOf(x) < 0);
				if (invalidProp) {
					return {
						Error: `Invalid property: "${invalidProp}"`
					};
				}

				// We don't have any extra properties.
				// Let's validate the lens constants.
				const iolConstants = IolConstantNames.map(x => ({ name: x, settings: Settings.iolConstants[x], value: iol[x] }));

				const invalidConstant = iolConstants.find(x => typeof x.value !== 'number' || Number.isNaN(x.value) || x.value < x.settings.min || x.value > x.settings.max);
				if (invalidConstant) {
					return {
						Error: `${invalidConstant.name} must be between ${invalidConstant.settings.min} and ${invalidConstant.settings.max}`
					};
				}

				// Round IOL constants where necessary
				iolConstants.filter(x => typeof x.settings.roundedToSigFigs === 'number')
					.map(x => iol[x.name] = Math.round(x.value * Math.pow(10, x.settings.roundedToSigFigs!)) / Math.pow(10, x.settings.roundedToSigFigs!));

				// Finally, validate the lens powers.
				if ((typeof iol.Powers !== 'undefined' && !Array.isArray(iol.Powers)) || (Array.isArray(iol.Powers) && (iol.Powers.length === 0 || iol.Powers.length >= 100))) {
					return {
						Error: 'If you specify Powers, you must specify an array with at least one range'
					};
				} else if (Array.isArray(iol.Powers) && iol.Powers.filter(x => typeof x.From !== 'number' || isNaN(x.From) || typeof x.To !== 'number' || isNaN(x.To) || typeof x.By !== 'number' || isNaN(x.By) || x.From > x.To || x.From < Settings.iolPower.min || x.To > Settings.iolPower.max || x.By < 0.1).length) {
					return {
						Error: `At least one power range is invalid: they must specify valid numbers for "From," "To," and "By." "From" cannot be greater than "To," "From" and "To" must be between ${Settings.iolPower.min} and ${Settings.iolPower.max}, and "By" must be at least 0.1.`
					};
				}

				try {
					let powers: Array<number> = [];

					if (typeof iol.Powers !== 'undefined') {
						powers = enumeratePowers(iol.Powers)!.sort((a, b) => a - b);
					}

					if (powers.length === 0) {
						powers = enumeratePowers([{ From: Settings.iolPower.min, To: 0, By: 1 }, { From: 0.5, To: 33.5, By: 0.5 }, { From: 34, To: Settings.iolPower.max, By: 1 }])!;
					}

					type inlinePrediction = { power: number, prediction: number, index: number };

					const predictionsOrErrors = powers.map((power: number, index: number): inlinePrediction | string => {
						const prediction = formula.calculate(iol, power);
						if (typeof prediction === 'string') {
							return prediction;
						} else {
							return { power: power, prediction: prediction, index: index };
						}
					});

					const predictions = predictionsOrErrors.filter(x => typeof x !== 'string') as Array<inlinePrediction>;

					const reduceToBest = (prev: inlinePrediction, next: inlinePrediction): inlinePrediction => Math.abs(next.prediction - eye.TgtRx) < Math.abs(prev.prediction - eye.TgtRx) ? next : prev;
					const bestPrediction = predictions.reduce(reduceToBest);

					const answers = [bestPrediction];
					let bestIndex = 0;

					const nextOptions = [predictions[bestPrediction.index - 1], predictions[bestPrediction.index + 1]];
					for (let i = 1; i < predictionsPerIol; i++) {
						const nextBest = typeof nextOptions[0] === 'undefined' && typeof nextOptions[1] !== 'undefined' ? 1 :
							typeof nextOptions[0] !== 'undefined' && typeof nextOptions[1] === 'undefined' ? 0 :
								typeof nextOptions[0] !== 'undefined' && typeof nextOptions[1] !== 'undefined' ?
									Math.abs(nextOptions[0].prediction - eye.TgtRx) <= Math.abs(nextOptions[1].prediction - eye.TgtRx) ? 0 : 1
									: -1;

						if (nextBest < 0) {
							break;
						} else {
							(nextBest === 0 ? answers.unshift : answers.push).call(answers, nextOptions[nextBest]);
							bestIndex += 1 - nextBest;
							nextOptions[nextBest] = predictions[nextOptions[nextBest].index + (2 * nextBest - 1)];
						}
					}

					return {
						Predictions: answers.map((x, i) => ({
							IOL: x.power,
							Rx: Math.round(x.prediction * Math.pow(10, Settings.roundAnswerSigFigs)) / Math.pow(10, Settings.roundAnswerSigFigs),
							IsBestOption: i === bestIndex ? true : undefined
						}))
					};
				} catch {
					return {
						Error: 'An unknown error occurred while calculating.'
					};
				}
			})
		};
	}

	static calculatePostopEyes(inputs: PostopApiInputs): string | PostopApiOutput {
		const answer = { } as PostopApiOutput;

		IolConstantNames.map(x => ({ name: x, roundTo: Settings.iolConstants[x].roundedToSigFigs, value: inputs[x] }))
			.map(x => answer[x.name] = typeof x.roundTo === 'number' && !Number.isNaN(x.roundTo) ? Math.round(x.value * Math.pow(10, x.roundTo)) / Math.pow(10, x.roundTo) : x.value);

		let numIterations = 0;

		if (inputs.Optimize) {
			const allEyes = inputs.Eyes.map(eye => T2Formula.getPostopFormula(inputs.KIndex, eye, true));

			const guesses = (allEyes.filter(x => typeof x !== 'string') as Array<PostopFormula>)
				.map(x => ({ gatinelFkp: x.gatinelFkp, calculate: x.calculate, guess: x.calculate(answer) as number }))
				.filter(x => typeof x.guess === 'number');

			if (guesses.length < Settings.optimizeEyes.minEyes || guesses.length > Settings.postopEyes.max) {
				return `Bad Request\nWhen optimizing lens constants, you must provide between ${Settings.optimizeEyes.minEyes} and ${Settings.postopEyes.max} eyes with valid data.`;
			}

			const currentGuess = {
				constants: answer,
				numIterations: 1,
				totalError: guesses.reduce((a, b) => a + b.guess, 0),
				totalFkp: guesses.reduce((a, b) => a + b.gatinelFkp, 0)
			};

			const variableToAlter = Settings.iolConstants.constantToOptimizeVariableName;
			const roundTo = Math.pow(10, Settings.iolConstants[variableToAlter].roundedToSigFigs || 10);

			while (Math.abs(currentGuess.totalError / guesses.length) >= 1 / roundTo && currentGuess.numIterations < 20) {
				currentGuess.numIterations++;
				const deltaElp = currentGuess.totalError / currentGuess.totalFkp;

				// TODO: If your main lens constant is not an A-constant, you'll have to modify this equation.
				currentGuess.constants[variableToAlter] = ((currentGuess.constants[variableToAlter] * 0.62467 - 68.747 - deltaElp) + 68.747) / 0.62467;
				currentGuess.totalError = guesses.reduce((a, b) => a + (x => typeof x === 'number' ? x : 0)(b.calculate(currentGuess.constants)), 0);
			}

			numIterations = currentGuess.numIterations;
			answer[variableToAlter] = Math.round(currentGuess.constants[variableToAlter] * roundTo) / roundTo;
		}

		answer.Predictions = inputs.Eyes.map(eye => T2Formula.calculatePostop(answer, inputs.KIndex, eye))

		return answer;
	}

	static calculatePostop(constants: IolConstantValues, kIndex: number, eye: PostopEyeObject): string | number {
		const formula = T2Formula.getPostopFormula(kIndex, eye, true);

		if (typeof formula === 'string') {
			return formula;
		}

		return formula.calculate(constants);
	};

	static getPostopFormula(kIndex: number, eye: PostopEyeObject, round: boolean): string | PostopFormula {
		const allowedProperties = Object.keys(Settings.variables).concat('IolPower');
		const invalidProp = Object.keys(eye).find(x => allowedProperties.indexOf(x) < 0);

		if (invalidProp) {
			return `Invalid property: ${invalidProp}`;
		}

		const formula = new T2Formula(eye, kIndex);
		const error = formula.error || (typeof eye.IolPower !== 'number' || isNaN(eye.IolPower) || eye.IolPower < Settings.iolPower.min || eye.IolPower > Settings.iolPower.max ? `IolPower must be a number between ${Settings.iolPower.min} and ${Settings.iolPower.max}` : undefined);

		if (error !== undefined) {
			return error;
		}

		return {
			gatinelFkp: 0.0006 * (eye.IolPower * eye.IolPower + (eye.K1! + eye.K2!) * eye.IolPower),
			calculate: (constants: IolConstantValues) => {
				try {
					const prediction = formula.calculate(constants, eye.IolPower);
					if (typeof prediction === 'string') {
						return prediction;
					}
					return round ? Math.round(prediction * 10000) / 10000 : prediction;
				} catch {
					return 'An unknown error occurred while calculating.';
				}
			}
		};
	}
}
