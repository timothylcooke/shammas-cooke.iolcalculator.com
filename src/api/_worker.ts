import Env from './Helpers/Env';
import Route from './Helpers/Route';
import statusCodeResponse from './Helpers/statusCodeResponse';

const resources: Array<Route> = [
	new Route(/^\/+$/i, '/'),
	new Route(/^\/+index.js$/i, '/index.js'),
	new Route(/^\/+Documentation\/*$/i, '/Documentation', '/'),
];

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url: URL = new URL(request.url);

		const resource: Route | undefined = resources.find(x => x.matches(url.pathname));

		if (resource) {
			// We matched a page.
			return resource.respond(url.pathname, request, env);
		}

		return await statusCodeResponse(request, env, 404, 'Not Found', 'The page you requested does not exist.');
	}
};
