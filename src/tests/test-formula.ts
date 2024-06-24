import test from 'node:test';
import assert from 'node:assert';
import ShammasCookeFormula from '../api/IolFormula/ShammasCookeFormula';

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
	closeEnough( -0.352000819002749, new ShammasCookeFormula({ AL: 23.600300773978233, K1: 44.082986036548014, K2: 44.159396314530696 }, 1.3375, 12).calculate({ AConstant: 119 }, 21.0));
	closeEnough( -1.17580998026817 , new ShammasCookeFormula({ AL: 23.589400574564934, K1: 44.11776282715324 , K2: 44.38139930062693  }, 1.3375, 12).calculate({ AConstant: 119 }, 22.0));
	closeEnough( -0.343474704049891, new ShammasCookeFormula({ AL: 23.930100724101067, K1: 41.21011413373744 , K2: 42.48884388734912  }, 1.3375, 12).calculate({ AConstant: 119 }, 23.0));
	closeEnough( -1.63932264844746 , new ShammasCookeFormula({ AL: 23.99853989481926 , K1: 41.64827560660122 , K2: 42.85517229555152  }, 1.3375, 12).calculate({ AConstant: 119 }, 24.0));
	closeEnough(-14.7052536818772  , new ShammasCookeFormula({ AL: 27.00739912688732 , K1: 45.95402887494731 , K2: 47.09208890744176  }, 1.3375, 12).calculate({ AConstant: 119 }, 25.0));
	closeEnough(-14.8305718326256  , new ShammasCookeFormula({ AL: 26.955800130963326, K1: 45.22839650482536 , K2: 46.57650834119935  }, 1.3375, 12).calculate({ AConstant: 119 }, 26.0));
	closeEnough( -4.18091904468891 , new ShammasCookeFormula({ AL: 24.7770007699728  , K1: 40.13689830901598 , K2: 41.11188063320193  }, 1.3375, 12).calculate({ AConstant: 119 }, 27.0));
	closeEnough( -5.33301714503487 , new ShammasCookeFormula({ AL: 24.760720506310463, K1: 40.2961224272421  , K2: 41.5951259787359   }, 1.3375, 12).calculate({ AConstant: 119 }, 28.0));
	closeEnough( -7.98632301609633 , new ShammasCookeFormula({ AL: 26.078380271792412, K1: 39.34842412695875 , K2: 39.985148251959664 }, 1.3375, 12).calculate({ AConstant: 119 }, 29.0));
	closeEnough( -8.19204845296087 , new ShammasCookeFormula({ AL: 25.680160149931908, K1: 39.58341042138732 , K2: 40.14249625867187  }, 1.3375, 12).calculate({ AConstant: 119 }, 30.0));
	closeEnough(-18.9214749630407  , new ShammasCookeFormula({ AL: 30.81749938428402 , K1: 42.46266293625579 , K2: 45.12782295103     }, 1.3375, 12).calculate({ AConstant: 119 }, 24.5));
	closeEnough(  3.84779212268575 , new ShammasCookeFormula({ AL: 20.291699096560478, K1: 43.765035968692324, K2: 44.46927085082063  }, 1.3375, 12).calculate({ AConstant: 119 }, 27.5));

	closeEnough( -0.352248802736861, new ShammasCookeFormula({ AL: 23.600300773978233, K1: 44.082986036548014, K2: 44.159396314530696 }, 1.3375, 14).calculate({ AConstant: 119 }, 21.0));
	closeEnough( -1.1785815561808  , new ShammasCookeFormula({ AL: 23.589400574564934, K1: 44.11776282715324 , K2: 44.38139930062693  }, 1.3375, 14).calculate({ AConstant: 119 }, 22.0));
	closeEnough( -0.343710815991494, new ShammasCookeFormula({ AL: 23.930100724101067, K1: 41.21011413373744 , K2: 42.48884388734912  }, 1.3375, 14).calculate({ AConstant: 119 }, 23.0));
	closeEnough( -1.64471508582834 , new ShammasCookeFormula({ AL: 23.99853989481926 , K1: 41.64827560660122 , K2: 42.85517229555152  }, 1.3375, 14).calculate({ AConstant: 119 }, 24.0));
	closeEnough(-15.150847802747   , new ShammasCookeFormula({ AL: 27.00739912688732 , K1: 45.95402887494731 , K2: 47.09208890744176  }, 1.3375, 14).calculate({ AConstant: 119 }, 25.0));
	closeEnough(-15.2839100854365  , new ShammasCookeFormula({ AL: 26.955800130963326, K1: 45.22839650482536 , K2: 46.57650834119935  }, 1.3375, 14).calculate({ AConstant: 119 }, 26.0));
	closeEnough( -4.21617400910973 , new ShammasCookeFormula({ AL: 24.7770007699728  , K1: 40.13689830901598 , K2: 41.11188063320193  }, 1.3375, 14).calculate({ AConstant: 119 }, 27.0));
	closeEnough( -5.3905125365912  , new ShammasCookeFormula({ AL: 24.760720506310463, K1: 40.2961224272421  , K2: 41.5951259787359   }, 1.3375, 14).calculate({ AConstant: 119 }, 28.0));
	closeEnough( -8.11595631350468 , new ShammasCookeFormula({ AL: 26.078380271792412, K1: 39.34842412695875 , K2: 39.985148251959664 }, 1.3375, 14).calculate({ AConstant: 119 }, 29.0));
	closeEnough( -8.32850346074298 , new ShammasCookeFormula({ AL: 25.680160149931908, K1: 39.58341042138732 , K2: 40.14249625867187  }, 1.3375, 14).calculate({ AConstant: 119 }, 30.0));
	closeEnough(-19.6656823972625  , new ShammasCookeFormula({ AL: 30.81749938428402 , K1: 42.46266293625579 , K2: 45.12782295103     }, 1.3375, 14).calculate({ AConstant: 119 }, 24.5));
	closeEnough(  3.81840724802544 , new ShammasCookeFormula({ AL: 20.291699096560478, K1: 43.765035968692324, K2: 44.46927085082063  }, 1.3375, 14).calculate({ AConstant: 119 }, 27.5));

	closeEnough( -0.085922316825334, new ShammasCookeFormula({ AL: 23.600300773978233, K1: 44.082986036548014, K2: 44.159396314530696 }, 1.3375, 12).calculate({ AConstant: 119.33 }, 21.0));
	closeEnough( -0.89194158640871 , new ShammasCookeFormula({ AL: 23.589400574564934, K1: 44.11776282715324 , K2: 44.38139930062693  }, 1.3375, 12).calculate({ AConstant: 119.33 }, 22.0));
	closeEnough( -0.056455389853572, new ShammasCookeFormula({ AL: 23.930100724101067, K1: 41.21011413373744 , K2: 42.48884388734912  }, 1.3375, 12).calculate({ AConstant: 119.33 }, 23.0));
	closeEnough( -1.33183824808337 , new ShammasCookeFormula({ AL: 23.99853989481926 , K1: 41.64827560660122 , K2: 42.85517229555152  }, 1.3375, 12).calculate({ AConstant: 119.33 }, 24.0));
	closeEnough(-14.3226374220934  , new ShammasCookeFormula({ AL: 27.00739912688732 , K1: 45.95402887494731 , K2: 47.09208890744176  }, 1.3375, 12).calculate({ AConstant: 119.33 }, 25.0));
	closeEnough(-14.4322812837231  , new ShammasCookeFormula({ AL: 26.955800130963326, K1: 45.22839650482536 , K2: 46.57650834119935  }, 1.3375, 12).calculate({ AConstant: 119.33 }, 26.0));
	closeEnough( -3.82649448234233 , new ShammasCookeFormula({ AL: 24.7770007699728  , K1: 40.13689830901598 , K2: 41.11188063320193  }, 1.3375, 12).calculate({ AConstant: 119.33 }, 27.0));
	closeEnough( -4.95647572888966 , new ShammasCookeFormula({ AL: 24.760720506310463, K1: 40.2961224272421  , K2: 41.5951259787359   }, 1.3375, 12).calculate({ AConstant: 119.33 }, 28.0));
	closeEnough( -7.59338454222778 , new ShammasCookeFormula({ AL: 26.078380271792412, K1: 39.34842412695875 , K2: 39.985148251959664 }, 1.3375, 12).calculate({ AConstant: 119.33 }, 29.0));
	closeEnough( -7.77897132741384 , new ShammasCookeFormula({ AL: 25.680160149931908, K1: 39.58341042138732 , K2: 40.14249625867187  }, 1.3375, 12).calculate({ AConstant: 119.33 }, 30.0));
	closeEnough(-18.5623254975655  , new ShammasCookeFormula({ AL: 30.81749938428402 , K1: 42.46266293625579 , K2: 45.12782295103     }, 1.3375, 12).calculate({ AConstant: 119.33 }, 24.5));
	closeEnough(  4.19895765498753 , new ShammasCookeFormula({ AL: 20.291699096560478, K1: 43.765035968692324, K2: 44.46927085082063  }, 1.3375, 12).calculate({ AConstant: 119.33 }, 27.5));
});
