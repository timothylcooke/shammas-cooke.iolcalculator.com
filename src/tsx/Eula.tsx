import { Button, Modal } from 'react-bootstrap';

type EulaProps = {
	eula: boolean,
	setEula: (value: boolean) => void
};

export default function Eula(props: EulaProps) {
	const acceptEula = () => {
		const oldState = window.history.state || {};
		oldState.usr = oldState.usr || {};
		oldState.usr.eula = true;
		window.history.replaceState(oldState, '', window.location.pathname);
		props.setEula(true);
	};

	return (
		<Modal show={!props.eula}
			backdrop="static"
			keyboard={false}>
			<Modal.Header>
				<Modal.Title>End User Licensing Agreement</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>
					Please read the following terms before using this website. By choosing “Accept” or by using the website,
					you agree to be bound by all terms and conditions.
				</p>
				<p>
					<strong>TODO:</strong> You can fill out your own info here.
				</p>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={acceptEula}>Accept</Button>
			</Modal.Footer>
		</Modal>
	);
}
