import { validateInputs, PostopApiInputs, PreopApiInputs } from '../IolFormula/ApiVariables';
import Env from './Env';


export default class ApiRoute {
	static Preop = async function(inputs: PreopApiInputs, request: Request, env: Env): Promise<Response> {
		const requestError = await validateInputs(inputs, true, request, env);

		if (requestError) {
			return requestError;
		}

		throw 'preop passed validation; formula not implemented!';
	}

	static Postop = async function(inputs: PostopApiInputs, request: Request, env: Env): Promise<Response> {
		const requestError = await validateInputs(inputs, false, request, env);

		if (requestError) {
			return requestError;
		}

		throw 'postop passed validation; formula not implemented!';
	}
};
