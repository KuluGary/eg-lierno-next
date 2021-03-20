import { useIsAuthenticated } from 'providers/Auth';
import withConditionalRedirect from './withConditionalReditect';

export default function withoutAuth(WrappedComponent, location = '/') {
    return withConditionalRedirect({
        WrappedComponent,
        location,
        clientCondition: function withoutAuthClientCondition() {
            return useIsAuthenticated();
        },
        serverCondition: function withoutAuthServerCondition(ctx) {
            return !!ctx.req?.cookies.session;
        }
    })
}