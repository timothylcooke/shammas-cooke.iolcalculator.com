import { PageProps } from './ApiPageProps';

export default function Example(props: PageProps) {
	const postop = {
		request: '{"KIndex":1.3375,"V":12,"AConstant":119,"Optimize":false,"Eyes":[{"AL":27.60,"K1":38.12,"K2":38.12,"IolPower":20},{"AL":25.29,"K1":37.72,"K2":38.9,"IolPower":20}]}',
		response: '{"AConstant":119,"Predictions":[-1.6298,2.3145]}'
	};

	const preop = {
		request: '{"KIndex":1.3375,"V":12,"PredictionsPerIol":7,"IOLs":[{"AConstant":119.33,"Powers":[{"From":6,"To":30,"By":0.5}]}],"Eyes":[{"TgtRx":-1,"K1":38.26,"K2":38.47,"AL":27.07}]}',
		response: '[{"IOLs":[{"Predictions":[{"IOL":19,"Rx":0.022},{"IOL":19.5,"Rx":-0.3488},{"IOL":20,"Rx":-0.7241},{"IOL":20.5,"Rx":-1.1041,"IsBestOption":true},{"IOL":21,"Rx":-1.4889},{"IOL":21.5,"Rx":-1.8785},{"IOL":22,"Rx":-2.2731}]}]}]'
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
