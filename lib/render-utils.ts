import { ReactElement } from 'react';

export function renderComponentToSvg(component: ReactElement): string {
    // We use a dynamic require to bypass Next.js static analysis which throws a warning/error
    // when importing 'react-dom/server' in Route Handlers, even if runtime is nodejs.
    // This is safe because we enforce 'nodejs' runtime in the route handler.

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ReactDOMServer = require('react-dom/server');
    return ReactDOMServer.renderToStaticMarkup(component);
}