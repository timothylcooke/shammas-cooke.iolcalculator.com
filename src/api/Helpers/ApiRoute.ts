import { PostopApiInputs, PreopApiInputs } from '../IolFormula/ApiTypes';
import { validateInputs } from '../IolFormula/ApiVariables';
import T2Formula from '../IolFormula/T2Formula';
import Env from './Env';
import statusCodeResponse from './statusCodeResponse';


export default class ApiRoute {
	static Preop = async function(inputs: PreopApiInputs, request: Request, env: Env): Promise<Response> {
		const requestError = await validateInputs(inputs, true, request, env);

		if (requestError) {
			return requestError;
		}

		// At this point, we know we have acceptable values for PredictionsPerIol, KIndex, and we know we have a valid number of Eyes and IOLs.
		// That means we've got enough for a 200 response. If there are any problems with individual eyes or IOLs, we'll return errors on an individual basis.
		return new Response(JSON.stringify((inputs.Eyes).map(eye => T2Formula.calculatePreOp(inputs.KIndex, inputs.PredictionsPerIol, inputs.IOLs, eye))), { headers: { 'content-type': 'application/json' } });
	}

	static Postop = async function(inputs: PostopApiInputs, request: Request, env: Env): Promise<Response> {
		const requestError = await validateInputs(inputs, false, request, env);

		if (requestError) {
			return requestError;
		}

		const answer = T2Formula.calculatePostopEyes(inputs);

		if (typeof answer === 'string') {
			return await statusCodeResponse(request, env, 400, answer);
		}

		return new Response(JSON.stringify(T2Formula.calculatePostopEyes(inputs)), { headers: { 'content-type': 'application/json' } });
	}
};
