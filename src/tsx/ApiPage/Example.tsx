import { PageProps } from './ApiPageProps';

export default function Example(props: PageProps) {
	// TODO: Here, we need to create example API requests and responses.
	// If you need help generating example requests/responses, I'm happy to help.
	const postop = {
		request: '{"KIndex":1.3375,"AConstant":119,"Optimize":false,"Eyes":[{"AL":23.60,"K1":44.12,"K2":44.12,"IolPower":20},{"AL":20.29,"K1":44.12,"K2":44.12,"IolPower":20}]}',
		response: '"TODO: NOT YET IMPLEMENTED"'
	};

	const preop = {
		request: '{"KIndex":1.3375,"PredictionsPerIol":7,"IOLs":[{"AConstant":119,"Powers":[{"From":6,"To":30,"By":0.5}]}],"Eyes":[{"TgtRx":-1,"K1":40,"K2":42,"AL":24}]}',
		response: '"TODO: NOT YET IMPLEMENTED"'
	};

	const { request, response } = (props.page === 'postop' ? postop : preop);

	const prettyRequest = JSON.stringify(JSON.parse(request), null, 4);
	const prettyResponse = JSON.stringify(JSON.parse(response), null, 4);

	return (
		<>
			<h1 className="display-4">Example</h1>
			<p className="lead">Request:</p>
			<pre className="bg-dark text-light py-2"><code>
				curl -X POST {window.location.origin}{new URL(window.location.href).pathname}<br />
				&nbsp;    -H &apos;Content-Type: application/json&apos;<br />
				&nbsp;    -d &apos;{request}&apos;
			</code></pre>
			<p className="lead">Formatted request:</p>
			<pre className="bg-dark text-light py-2"><code>
				POST {window.location.pathname} HTTP/1.1<br />
				Host: {window.location.host}<br />
				Content-Type: application/json<br />
				Content-Length: {prettyRequest.replaceAll('\n', '\r\n').length}<br />
				<br />
				{prettyRequest}
			</code></pre>
			<p className="lead">Formatted response:</p>
			<pre className="bg-dark text-light py-2"><code>
				HTTP/1.1 200 OK<br />
				Content-Type: application/json<br />
				Content-Length: {prettyResponse.replaceAll('\n', '\r\n').length}<br />
				<br />
				{prettyResponse}
			</code></pre>
		</>
	);
}
