import { Link } from 'react-router-dom';
import Settings from '../../api/Settings';
import HtmlSettings from '../HtmlSettings';
import ApiPageProps from './ApiPageProps';

export default function Title(props: ApiPageProps) {
	return (
		<>
			<h1 className="display-4">{HtmlSettings.formulaName} P{props.page.substring(1)}erative API</h1>
			<p className="lead">{window.location.origin}{new URL(window.location.href).pathname}</p>
			<p>This API is designed to let you {props.page === 'preop' ? <>use the {HtmlSettings.formulaName} formula in your own IOL calculator.</> : 'optimize your lens constants.'} If you are looking for an API to {props.page === 'preop' ? 'optimize your lens constants' : <>use the {HtmlSettings.formulaName} formula in your own IOL calculator</>}
			, please check out <Link to={`${Settings.apiUrl}/${props.page === 'preop' ? 'postop' : 'preop'}`} state={{ eula: props.eula }}>the {props.page === 'preop' ? 'post' : 'pre'}-op API.</Link></p>

			{props.page === 'preop' ?
				<p>This preoperative API allows you to specify preoperative variables, together with a target postoperative refraction, and returns the IOL power that yields the predicted refraction closest to the specified target refraction, as well as a few additional IOL powers. For each IOL power returned, the API also specifies the corresponding predicted postoperative refraction.</p> :
				<p>This postoperative API allows you to specify preoperative variables, together with just one IOL power per eye, and get the predicted postoperative refraction for up to {Settings.postopEyes.max.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} eyes per API request.</p>
			}
		</>
	);
}
