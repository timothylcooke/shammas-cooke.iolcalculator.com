import Env from './Helpers/Env';
import Route from './Helpers/Route';
import statusCodeResponse from './Helpers/statusCodeResponse';
import Settings from './Settings';
import { WorkerEntrypoint } from 'cloudflare:workers';

const resources: Array<Route> = [
	'/favicon.png',
	'/favicon.svg',
	'/favicon.ico',
	'/',
	'/PrintPreview',
	'/Documentation',
	Settings.apiUrl,
	`${Settings.apiUrl}/preop`,
	`${Settings.apiUrl}/postop`
].map(x => new Route(x));

export default class extends WorkerEntrypoint<Env> {
	async fetch(request: Request): Promise<Response> {
		if (!'OPTIONS'.localeCompare(request.method, undefined, { sensitivity: 'accent' })) {
			const response: Response = await this.env.ASSETS.fetch(new Request(request.url, { cf: request.cf, headers: request.headers, method: request.method }));
			const headers = new Headers(response.headers);
			headers.append('Access-Control-Request-Method', 'GET,POST');
			headers.append('Access-Control-Allow-Headers', '*');
			return new Response(null, {
				cf: response.cf,
				headers: headers,
				statusText: 'No Content',
				status: 204
			});
		}

		const url: URL = new URL(request.url);

		const resource: Route | undefined = resources.find(x => x.matches(url.pathname));

		if (resource) {
			// We matched a page.
			return resource.respond(url.pathname, request, this.env);
		}

		return await statusCodeResponse(request, this.env, 404, 'Not Found', 'The page you requested does not exist.');
	}
};
