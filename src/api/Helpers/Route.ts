import Env from './Env';
import statusCodeResponse from './statusCodeResponse';

export default class Route {
	private regex: RegExp;
	private redirectTo: string;
	private resourceUrl: string;

	/**
	 * Represents a Valid URL that _worker.ts can return, if the request method is GET.
	 * @param regex A regular expression that matches any pathname that should return this request.
	 * @param redirectTo The valid pathname. If the regex matches, then this method will return a 308 to this URL, if applicable.
	 */
	constructor(regex: RegExp, redirectTo: string, resourceUrl?: string) {
		this.regex = regex;
		this.redirectTo = redirectTo;
		this.resourceUrl = resourceUrl || redirectTo;
	}

	public matches = (pathname: string): boolean => {
		return pathname.match(this.regex) != null;
	};

	public respond = async (pathname: string, request: Request, env: Env): Promise<Response> => {
		if ('GET'.localeCompare(request.method, undefined, { sensitivity: 'accent' })) {
			// The request Method is not "GET". Return 405.
			return await statusCodeResponse(request, env, 405, 'Method Not Allowed');
		} else if (pathname === this.redirectTo) {
			return env.ASSETS.fetch(new Request(new URL(this.resourceUrl, request.url), { cf: request.cf, headers: request.headers }));
		} else {
			return Response.redirect(new URL(this.redirectTo, request.url).href, 308);
		}
	};
}
