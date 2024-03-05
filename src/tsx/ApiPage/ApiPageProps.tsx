type Page = 'preop' | 'postop';

type ApiPageProps = {
	eula: boolean,
	page: Page
}

type PageProps = {
	page: Page;
}

export { PageProps };
export default ApiPageProps;
