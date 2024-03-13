import ApiPageProps from './ApiPageProps';
import Example from './Example';
import EyeObjects from './EyeObjects';
import IolObjects from './IolObjects';
import Title from './Title';
import Properties from './Properties';
import Response from './Response';

export default function ApiPage(props: ApiPageProps) {
	return (
		<div className="container py-3">
			<div className="row justify-content-center">
				<Title eula={props.eula} page={props.page} />
				<Properties page={props.page} />
				{props.page === 'preop' ? <IolObjects /> : undefined}
				<EyeObjects page={props.page} />
				<Response page={props.page} />
				<Example page={props.page} />
			</div>
		</div>
	);
}
