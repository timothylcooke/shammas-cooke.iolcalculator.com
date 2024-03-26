import ApiRoute from './ApiRoute';
import Settings from '../Settings';
import Env from './Env';
import statusCodeResponse from './statusCodeResponse';
import { PostopApiInputs, PreopApiInputs } from '../IolFormula/ApiTypes';

export default class Route {
	private pathname: string;
	private resourceUrl: string;
	private regex: RegExp;

	/**
	 * Represents a Valid URL that _worker.ts can return, if the request method is GET.
	 * @param pathname The valid pathname. If the regex matches, then this method will return a 308 to this URL, if the request's actual pathname is not exactly equal to this value.
	 * @param regex A regular expression that matches any pathname that should return this request.
	 * @param resourceUrl The URL to load
	 */
	constructor(pathname: string, resourceUrl?: string, regex?: RegExp) {
		this.pathname = pathname;
		this.resourceUrl = resourceUrl || pathname;
		if (!regex) {
			const dot = /\./;
			if (pathname.match(dot)) {
				// The pathname contains a '.' character. Let's assume it's a file.
				regex = new RegExp(`^${pathname.replace(/\//, '\\/+').replace(/\./, '\\.')}$`);
			} else {
				// The pathname does not contain a '.' character. It must be a webpage, and (therefore) equivalent to loading '/'.
				regex = new RegExp(`^${pathname.replace(/\//, '\\/+')}\\/*$`);
				this.resourceUrl = '/';
			}
		}
		this.regex = regex ?? new RegExp(pathname.replace(/\./, '\\.'));
	}

	public matches = (pathname: string): boolean => {
		return pathname.match(this.regex) != null;
	};

	public respond = async (pathname: string, request: Request, env: Env): Promise<Response> => {
		if (!'POST'.localeCompare(request.method, undefined, { sensitivity: 'accent' }) && this.pathname.indexOf(`${Settings.apiUrl}/`) >= 0) {
			// This is a valid POST request to a valid endpoint.

			// We need a 'Content-Type' header of 'application/json'
			const contentType: string | null = request.headers.get('content-type');
			if (typeof contentType !== 'string' || contentType.indexOf('application/json') < 0) {
				return await statusCodeResponse(request, env, 415, 'Unsupported Media Type', 'Content-Type must be "application/json"');
			}

			// Let's make sure we can parse JSON
			let requestBody: unknown;
			try {
				requestBody = await request.json();
			} catch {
				return await statusCodeResponse(request, env, 400, 'Bad Request', 'Bad Request:\nRequest is not valid JSON');
			}

			// And make sure it parses to a simple object.
			if (typeof requestBody !== 'object' || Array.isArray(requestBody)) {
				return await statusCodeResponse(request, env, 400, 'Bad Request', 'Bad Request:\nRequest is not an object');
			}

			return await this.pathname.endsWith('preop') ?
				ApiRoute.Preop(requestBody as PreopApiInputs, request, env) :
				ApiRoute.Postop(requestBody as PostopApiInputs, request, env);
		} else if ('GET'.localeCompare(request.method, undefined, { sensitivity: 'accent' })) {
			// The request Method is not "GET". Return 405.
			return await statusCodeResponse(request, env, 405, 'Method Not Allowed');
		} else if (pathname === this.pathname) {
			return env.ASSETS.fetch(new Request(new URL(this.resourceUrl, request.url), { cf: request.cf, headers: request.headers }));
		} else {
			return Response.redirect(new URL(this.pathname, request.url).href, 308);
		}
	};
}
