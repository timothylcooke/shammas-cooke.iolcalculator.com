import { Button, Modal } from 'react-bootstrap';
import { BaseProps } from './BaseProps';

export type EulaProps = BaseProps & {
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
					Please read the following terms before using the Shammas-Cooke Formula website. By choosing “Accept” or
					by using the website, you agree to be bound by all terms and conditions herein.
				</p>
				<p>
					This agreement between H. John Shammas, M.D., David L. Cooke, M.D., and the user grants the user the right
					to access and use the Shammas-Cooke Formula website for educational and clinical purposes only. All rights
					granted in these terms are non-exclusive and non-transferable.
				</p>
				<p>
					This formula website is owned by Drs. Shammas and Cooke and based on their intellectual property. It is
					protected by US copyright laws and other applicable international laws and treaties. Users of this formula
					website acquire no ownership right, title or interest in the Shammas-Cooke Formula, or in any applicable
					patents, trademarks, copyrights, trade secrets, and other intellectual property rights contained in or
					associated with the service.
				</p>
				<p>
					The information provided by the Shammas-Cooke Formula website is provided to the user without a warranty
					of any kind. The user indemnifies and holds David L. Cooke, M.D. and H. John Shammas, M.D. harmless from
					and against all loss, cost, claims, or damages arising from the use of this formula website and the information
					provided. The user assumes all risks and responsibilities for the use of any information provided by the
					website. When used for clinical purposes, the user must make their own independent clinical determination
					regarding their patient’s care.
				</p>
				<p>
					The user may not attempt to reproduce or modify the Shammas-Cooke Formula website. The user may not
					reverse engineer, decompile, or disassemble the Shammas-Cooke Formula website. The user may not adapt,
					modify, create derivative works, operate a service bureau, or act as a Software as a Service (SaaS) provider
					based on the Shammas-Cooke Formula website.
				</p>
				<p>
					The Shammas-Cooke Formula website is configured to encrypt data in transit between the user and the
					website using HTTPS. The user is responsible to confirm that the connection is secure using the mechanisms
					provided by their browser. The website is not configured to store or transmit individually identifiable
					information provided by the user. Users are solely responsible to follow all applicable laws regarding privacy
					and patient information they may be bound by, such as HIPAA.
				</p>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={acceptEula}>Accept</Button>
			</Modal.Footer>
		</Modal>
	);
}
