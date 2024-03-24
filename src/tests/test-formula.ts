import test from 'node:test';
import assert from 'node:assert';
import T2Formula from '../api/IolFormula/T2Formula';

const assertCloseEnough = (expected: number, actual: number, epsilon: number) => {
	assert.ok(Math.abs(expected - actual) <= epsilon, `Values are not close enough: expected ${expected}, got ${actual}`);
}
const closeEnough = (expected: number | string, actual: number | string) => {
	if (typeof expected === 'number' && typeof actual === 'number') {
		assertCloseEnough(expected, actual, 1E-10);
	} else {
		assert.ok(expected === actual, `Values are not equal: expected ${typeof expected === 'string' ? `"${expected}"` : expected}, got ${typeof actual === 'string' ? `"${actual}"` : actual}`);
	}
}

// The basic idea of these unit tests is to make sure this formula is accurate, and that any time you update your code, you didn't accidentally change the behavior of your formula.
// Ideally, you will have an external formula that is validated, and you can run the same calculations in your external calculator and make sure that you get the same results with this formula's code.
// If you have special logic that applies for eyes shorter than 20 mm (for example), then it's a good idea to create tests for AL = 19.999, 20.000, and 20.001, to make sure that your cutoff is applied as intended.

test('Some random tests', t => {
	// For each test, we paste the answer we expect to see (ideally from an externally-validated IOL calculator known to give valid predictions).
	// The tests will ensure that this code gives the same answer as your saved tests.
	closeEnough( -0.511022750699568, new T2Formula({ AL: 23.600300773978233, K1: 44.082986036548014, K2: 44.159396314530696, ACD: undefined, CCT: undefined, LT: undefined, WTW: undefined, CD: undefined }, 1.3375).calculate({ AConstant: 119 }, 21.0));
	closeEnough( -1.279688617802700, new T2Formula({ AL: 23.589400574564934, K1: 44.11776282715324 , K2: 44.38139930062693 , ACD: undefined, CCT: undefined, LT: undefined, WTW: undefined, CD: undefined }, 1.3375).calculate({ AConstant: 119 }, 22.0));
	closeEnough( -0.792915256128844, new T2Formula({ AL: 23.930100724101067, K1: 41.21011413373744 , K2: 42.48884388734912 , ACD: undefined, CCT: undefined, LT: undefined, WTW: undefined, CD: undefined }, 1.3375).calculate({ AConstant: 119 }, 23.0));
	closeEnough( -1.995579358078070, new T2Formula({ AL: 23.99853989481926 , K1: 41.64827560660122 , K2: 42.85517229555152 , ACD: undefined, CCT: undefined, LT: undefined, WTW: undefined, CD: undefined }, 1.3375).calculate({ AConstant: 119 }, 24.0));
	closeEnough(-13.779916234154600, new T2Formula({ AL: 27.00739912688732 , K1: 45.95402887494731 , K2: 47.09208890744176 , ACD: undefined, CCT: undefined, LT: undefined, WTW: undefined, CD: undefined }, 1.3375).calculate({ AConstant: 119 }, 25.0));
	closeEnough(-13.906311537386900, new T2Formula({ AL: 26.955800130963326, K1: 45.22839650482536 , K2: 46.57650834119935 , ACD: undefined, CCT: undefined, LT: undefined, WTW: undefined, CD: undefined }, 1.3375).calculate({ AConstant: 119 }, 26.0));
	closeEnough( -4.686082281755990, new T2Formula({ AL: 24.7770007699728  , K1: 40.13689830901598 , K2: 41.11188063320193 , ACD: undefined, CCT: undefined, LT: undefined, WTW: undefined, CD: undefined }, 1.3375).calculate({ AConstant: 119 }, 27.0));
	closeEnough( -5.749086433114900, new T2Formula({ AL: 24.760720506310463, K1: 40.2961224272421  , K2: 41.5951259787359  , ACD: undefined, CCT: undefined, LT: undefined, WTW: undefined, CD: undefined }, 1.3375).calculate({ AConstant: 119 }, 28.0));
	closeEnough( -8.417171961387690, new T2Formula({ AL: 26.078380271792412, K1: 39.34842412695875 , K2: 39.985148251959664, ACD: undefined, CCT: undefined, LT: undefined, WTW: undefined, CD: undefined }, 1.3375).calculate({ AConstant: 119 }, 29.0));
	closeEnough( -8.619314073357990, new T2Formula({ AL: 25.680160149931908, K1: 39.58341042138732 , K2: 40.14249625867187 , ACD: undefined, CCT: undefined, LT: undefined, WTW: undefined, CD: undefined }, 1.3375).calculate({ AConstant: 119 }, 30.0));
	closeEnough(-18.424773139286800, new T2Formula({ AL: 30.81749938428402 , K1: 42.46266293625579 , K2: 45.12782295103    , ACD: undefined, CCT: undefined, LT: undefined, WTW: undefined, CD: undefined }, 1.3375).calculate({ AConstant: 119 }, 24.5));
	closeEnough( +3.346227815286070, new T2Formula({ AL: 20.291699096560478, K1: 43.765035968692324, K2: 44.46927085082063 , ACD: undefined, CCT: undefined, LT: undefined, WTW: undefined, CD: undefined }, 1.3375).calculate({ AConstant: 119 }, 27.5));
});
