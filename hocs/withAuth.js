import { useIsAuthenticated } from 'providers/Auth';
import withConditionalRedirect from './withConditionalReditect';

export default function withAuth(WrappedComponent, location = '/login') {
    return withConditionalRedirect({
        WrappedComponent,
        location,
        clientCondition: function withAuthClientCondition() {
            return !useIsAuthenticated();
        },
        serverCondition: function withAuthServerCondition(ctx) {
            return !ctx.req?.cookies.session;
        }
    });
}