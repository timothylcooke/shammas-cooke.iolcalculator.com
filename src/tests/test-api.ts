import test from 'node:test';
import assert from 'node:assert';
import worker from '../api/_worker';
import Settings from '../api/Settings';
import { PreopApiError } from '../api/IolFormula/ApiTypes';

const unitTestsAuthHeader: string = 'Bearer UnitTests:MgSUOG7y5c8XvxsNL850KCAkXi17XZV18dW9ONCQLjPupJwTYyOOd9lK7yl9Dx9eMwkEpi0X8nakbrv+RwKjmoQ5qbgdAdg20PqIMCBDb4mqOsOX8grD281e26LEm0Sf';

type Endpoint = 'preop' | 'postop';
const url = (endpoint: Endpoint) => `https://fakehost.invalid${Settings.apiUrl}/${endpoint}`;
const urls = [url('preop'), url('postop')];

const env = { ASSETS: fetch };

const assertBadRequest = async (endpoint: Endpoint, requestBody: any, expectedError: string) => {
	const response = await worker.fetch(new Request(url(endpoint), { body: requestBody, method: 'POST', headers: { 'content-type': 'application/json', 'authorization': unitTestsAuthHeader } }), env);

	assert.strictEqual(response.status, 400);
	assert.strictEqual(response.statusText, 'Bad Request');
	assert.strictEqual((await response.json() as PreopApiError).Error, expectedError);
};
const assert200 = async (endpoint: Endpoint, requestBody: any, expectedResponse: string) => {
	const response = await worker.fetch(new Request(url(endpoint), { body: requestBody, method: 'POST', headers: { 'content-type': 'application/json', 'authorization': unitTestsAuthHeader } }), env);

	assert.strictEqual(response.status, 200);
	assert.strictEqual(await response.text(), expectedResponse);
};

test('Require application/json', async t => {
	// Here, we test that if an API caller does not specify a Content-Type containing "application/json", then the response returns a 415.
	for (const i in urls) {
		const response = await worker.fetch(new Request(urls[i], { method: 'POST', headers: { 'authorization': unitTestsAuthHeader } }), env);

		assert.strictEqual(response.status, 415);
		assert.strictEqual(response.statusText, 'Unsupported Media Type');
		assert.strictEqual((await response.json() as PreopApiError).Error, 'Content-Type must be "application/json"');
	};
});

test('Bad Requests', async t => {
	// Here, we test that if an API caller does not specify a complete request, they get a 400 error.
	await assertBadRequest('preop', '', 'Bad Request:\nRequest is not valid JSON');
	await assertBadRequest('preop', '[]', 'Bad Request:\nRequest is not an object');
	await assertBadRequest('preop', '{}', `Bad Request:\nRoot property "KIndex" must be a number between ${Settings.kIndex.min} and ${Settings.kIndex.max}.`);
	await assertBadRequest('preop', '{"badProperty":null}', `Bad Request:\nRoot property "badProperty" is not a valid property.`);
	await assertBadRequest('preop', '{"KIndex": 1}', `Bad Request:\nRoot property "V" must be a number between ${Settings.v.min} and ${Settings.v.max}.`);
	await assertBadRequest('preop', '{"KIndex": 1,"V":12}', `Bad Request:\nRoot property "PredictionsPerIol" is a required integer between ${Settings.predictionsPerIol.min} and ${Settings.predictionsPerIol.max}`);
	await assertBadRequest('preop', '{"KIndex": 1,"V":12,"PredictionsPerIol":7}', `Bad Request:\nRoot property "Eyes" must be an array containing between ${Settings.preopEyes.min} and ${Settings.preopEyes.max} eyes.`);
	await assertBadRequest('preop', '{"KIndex": 1,"V":12,"PredictionsPerIol":7, "Eyes":[]}', `Bad Request:\nRoot property "Eyes" must be an array containing between ${Settings.preopEyes.min} and ${Settings.preopEyes.max} eyes.`);
	await assertBadRequest('postop', '', 'Bad Request:\nRequest is not valid JSON');
	await assertBadRequest('postop', '[]', 'Bad Request:\nRequest is not an object');
	await assertBadRequest('postop', '{}', `Bad Request:\nRoot property "KIndex" must be a number between ${Settings.kIndex.min} and ${Settings.kIndex.max}.`);
	await assertBadRequest('postop', '{"badProperty": true}', 'Bad Request:\nRoot property "badProperty" is not a valid property.');
	await assertBadRequest('postop', '{"KIndex": 1}', `Bad Request:\nRoot property "V" must be a number between ${Settings.v.min} and ${Settings.v.max}.`);
	await assertBadRequest('postop', '{"KIndex": 1,"V":12}', 'Bad Request:\nRoot property "Optimize" must be a boolean.');
	await assertBadRequest('postop', '{"Optimize":false,"KIndex": 1,"V":12}', `Bad Request:\nRoot property "AConstant" is required and must be between ${Settings.iolConstants.AConstant.min} and ${Settings.iolConstants.AConstant.max}`);
	await assertBadRequest('postop', '{"Optimize":false,"KIndex": 1,"V":12,"AConstant":119, "Eyes": []}', `Bad Request:\nRoot property "Eyes" must be an array containing between ${Settings.postopEyes.min} and ${Settings.postopEyes.max} eyes.`);
});

test('Test Partially-Bad Request', async () => {
	// Here we test that a well-formed request with some bad missing or invalid data can return errors alongside successful responses.
	await assert200('preop', '{"KIndex":1.3375,"V":12,"PredictionsPerIol":1,"Eyes":[{},{"badProperty":true},{"TgtRx":-1,"K1":40,"K2":42,"AL":24},{"TgtRx":-1,"K1":40,"K2":42,"AL":24,"IOLs":[{"badProperty":true},{},{"AConstant":119}]}]}', `[{"Error":"AL is not a valid number."},{"Error":"Invalid property: \\"badProperty\\""},{"Error":"This eye does not have a valid amount of IOLs. You can specify default IOLs in the root \\"IOLs\\" property, and you can override it within individual eyes. You must specify between ${Settings.iolsPerEye.min} and ${Settings.iolsPerEye.max} IOLs."},{"IOLs":[{"Error":"Invalid property: \\"badProperty\\""},{"Error":"AConstant must be between ${Settings.iolConstants.AConstant.min} and ${Settings.iolConstants.AConstant.max}"},{"Predictions":[{"IOL":25,"Rx":-1.1545,"IsBestOption":true}]}]}]`);
	await assert200('postop', '{"Optimize": false, "KIndex": 1, "V":12, "AConstant": 119, "Eyes": [{"badProperty": true}, { }, { "AL": -1 }, { "AL": 23.6, "K1": 44.12, "K2": 44.12 }, { "AL":23.60, "K1":44.12, "K2":44.12, "IolPower":20 }]}', `{"AConstant":119,"Predictions":["Invalid property: \\"badProperty\\"","AL is not a valid number.","AL must be between ${Settings.variables.AL!.min} and ${Settings.variables.AL!.max}","IolPower must be a number between ${Settings.iolPower.min} and ${Settings.iolPower.max}",0.3557]}`);
});

test('Test predictionsPerIol', async () => {
	// Here, we test that by changing PredictionsPerIol, we get more or fewer predictions.
	await assert200('preop', '{"KIndex":1.3375,"V":12,"PredictionsPerIol":1,"IOLs":[{"AConstant":119,"Powers":[{"From":6,"To":30,"By":0.5}]}],"Eyes":[{"TgtRx":-1,"K1":40,"K2":42,"AL":24}]}', '[{"IOLs":[{"Predictions":[{"IOL":25,"Rx":-1.1545,"IsBestOption":true}]}]}]');
	await assert200('preop', '{"KIndex":1.3375,"V":12,"PredictionsPerIol":3,"IOLs":[{"AConstant":119,"Powers":[{"From":6,"To":30,"By":0.5}]}],"Eyes":[{"TgtRx":-1,"K1":40,"K2":42,"AL":24}]}', '[{"IOLs":[{"Predictions":[{"IOL":24.5,"Rx":-0.78},{"IOL":25,"Rx":-1.1545,"IsBestOption":true},{"IOL":25.5,"Rx":-1.5336}]}]}]');
	await assert200('preop', '{"KIndex":1.3375,"V":12,"PredictionsPerIol":5,"IOLs":[{"AConstant":119,"Powers":[{"From":6,"To":30,"By":0.5}]}],"Eyes":[{"TgtRx":-1,"K1":40,"K2":42,"AL":24}]}', '[{"IOLs":[{"Predictions":[{"IOL":24,"Rx":-0.4099},{"IOL":24.5,"Rx":-0.78},{"IOL":25,"Rx":-1.1545,"IsBestOption":true},{"IOL":25.5,"Rx":-1.5336},{"IOL":26,"Rx":-1.9174}]}]}]');
	await assert200('preop', '{"KIndex":1.3375,"V":12,"PredictionsPerIol":7,"IOLs":[{"AConstant":119,"Powers":[{"From":6,"To":30,"By":0.5}]}],"Eyes":[{"TgtRx":-1,"K1":40,"K2":42,"AL":24}]}', '[{"IOLs":[{"Predictions":[{"IOL":23.5,"Rx":-0.0443},{"IOL":24,"Rx":-0.4099},{"IOL":24.5,"Rx":-0.78},{"IOL":25,"Rx":-1.1545,"IsBestOption":true},{"IOL":25.5,"Rx":-1.5336},{"IOL":26,"Rx":-1.9174},{"IOL":26.5,"Rx":-2.3059}]}]}]');
	await assert200('preop', '{"KIndex":1.3375,"V":12,"PredictionsPerIol":9,"IOLs":[{"AConstant":119,"Powers":[{"From":6,"To":30,"By":0.5}]}],"Eyes":[{"TgtRx":-1,"K1":40,"K2":42,"AL":24}]}', '[{"IOLs":[{"Predictions":[{"IOL":22.5,"Rx":0.6739},{"IOL":23,"Rx":0.3169},{"IOL":23.5,"Rx":-0.0443},{"IOL":24,"Rx":-0.4099},{"IOL":24.5,"Rx":-0.78},{"IOL":25,"Rx":-1.1545,"IsBestOption":true},{"IOL":25.5,"Rx":-1.5336},{"IOL":26,"Rx":-1.9174},{"IOL":26.5,"Rx":-2.3059}]}]}]');
});

test('Test IOL override', async () => {
	// Here, we test that specifying different IOLs on a per-eye basis gives different predictions.
	await assert200('preop', '{"KIndex":1.3375,"V":12,"PredictionsPerIol":1,"IOLs":[{"AConstant":119,"Powers":[{"From":6,"To":30,"By":0.5}]}],"Eyes":[{"TgtRx":-1,"K1":40,"K2":42,"AL":24},{"TgtRx":-1,"K1":40,"K2":42,"AL":24,"IOLs":[{"AConstant":119,"Powers":[{"From":6,"To":30,"By":0.5}]},{"AConstant":119,"Powers":[{"From":6,"To":31,"By":5}]}]}]}', '[{"IOLs":[{"Predictions":[{"IOL":25,"Rx":-1.1545,"IsBestOption":true}]}]},{"IOLs":[{"Predictions":[{"IOL":25,"Rx":-1.1545,"IsBestOption":true}]},{"Predictions":[{"IOL":26,"Rx":-1.9174,"IsBestOption":true}]}]}]');
});

test('Test Optimize', async ()  => {
	// Here, we test the lens constant optimization process.
	await assertBadRequest('postop', '{"AConstant":119,"Optimize":true,"KIndex":1.3375,"V": 12,"Eyes":[{"IolPower":45,"K1":32,"K2":32,"AL":14,"Ref":0},{"IolPower":45,"K1":32,"K2":32,"AL":14,"Ref":0}]}', `Bad Request:\nWhen optimizing lens constants, you must provide between ${Settings.optimizeEyes.minEyes} and ${Settings.postopEyes.max} eyes with valid data.`);
	await assert200('postop', '{"KIndex":1.3375,"V": 12,"AConstant":121,"Optimize":true,"Eyes":[{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":0}]}', '{"AConstant":121.17331,"Predictions":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}');
	await assert200('postop', '{"KIndex":1.3375,"V": 12,"AConstant":121,"Optimize":true,"Eyes":[{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25},{"K1":45.91,"K2":45.91,"AL":21.88,"IolPower":27.5,"Ref":-0.25}]}', '{"AConstant":120.94121,"Predictions":[-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25,-0.25]}');
});
