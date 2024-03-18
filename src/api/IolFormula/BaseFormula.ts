import Settings, { IolConstantName, PreopVariableNames } from '../Settings';
import { EyeObject } from './ApiVariables';

export default abstract class BaseFormula {
	error: string | undefined;
	kIndex: number;
	variables: EyeObject;

	constructor(variables: EyeObject, kIndex: number) {
		this.kIndex = kIndex;
		this.variables = variables;

		// We already know that we don't have any extra variables.

		// Let's make sure that the caller specified all required variables.

		const allVariables = PreopVariableNames.map(x => ({ name: x, settings: Settings.variables[x]!, value: variables[x] }))
			// If a variable is not required, it won't be specified in Settings.variables.
			// If it's neither specified by the API caller nor the API settings, we can ignore it.
			.filter(x => typeof x.settings !== 'undefined');

		const invalidNumber = allVariables.find(x => x.settings?.usage === 'Required' && (typeof x.value !== 'number' || Number.isNaN(x.value)))?.name;

		if (invalidNumber) {
			this.error = `${invalidNumber} is not a valid number.`;
			return;
		}

		// Finally, let's make sure that all values are within limits.
		const outOfLimits = allVariables.filter(x => typeof x.value !== 'undefined').find(x => typeof x.value !== 'number' || Number.isNaN(x.value!) || x.value! < x.settings.min || x.value! > x.settings.max);
		if (outOfLimits) {
			this.error = `${outOfLimits.name} must be between ${outOfLimits.settings.min} and ${outOfLimits.settings.max}`;
		}

		// At this point, we know that:
		// Every required variable is specified, and:
		// Every variable (required or optional) is within the limits.

		// Let's convert the Ks based on Settings.convertKIndex
		if (typeof this.error === 'undefined') {
			if (this.kIndex !== 1 && this.kIndex !== Settings.convertKIndex) {
				if (this.variables.K1) {
					this.variables.K1 = (Settings.convertKIndex - 1) / (this.kIndex - 1) * this.variables.K1!;
				}
				if (this.variables.K2) {
					this.variables.K2 = (Settings.convertKIndex - 1) / (this.kIndex - 1) * this.variables.K2!;
				}

				this.kIndex = Settings.convertKIndex;
			}
		}
	}

	abstract calculate(iolConstants: { [key in IolConstantName]: number}, iolPower: number): number | string;
};
