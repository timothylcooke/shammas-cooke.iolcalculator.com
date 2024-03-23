type Page = 'preop' | 'postop';
import { BaseProps } from '../BaseProps';

type ApiPageProps = BaseProps & {
	page: Page
}

type PageProps = {
	page: Page;
}

export { PageProps };
export default ApiPageProps;
