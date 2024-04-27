import helmet from "helmet";
/*There are several HTTP security headers that can help you prevent some common attack vectors. 
The helmet package can help to set those headers: */
export default (app) => {
    app.use(helmet());
    app.use(
        helmet.hsts({
            maxAge: 123456,
            includeSubDomains: false,
        })
    );
    /*X-XSS-Protection: stops pages from loading when they detect reflected cross-site scripting (XSS) attacks. This header has been deprecated by modern browsers and its use can introduce additional security issues on the client side. As such, it is recommended to set the header as X-XSS-Protection: 0 in order to disable the XSS Auditor, and not allow it to take the default behavior of the browser handling the response.
     */
    app.use(helmet.xssFilter()); // sets "X-XSS-Protection: 0"

    /*X-Content-Type-Options: Even if the server sets a valid Content-Type header in the response, browsers may try to sniff the MIME type of the requested resource. This header is a way to stop this behavior and tell the browser not to change MIME types specified in Content-Type header. It can be configured in the following way: */
    app.use(helmet.noSniff());
    app.use(helmet.frameguard());
    app.use(helmet.hidePoweredBy());
    /*X-XSS-Protection: stops pages from loading when they detect reflected cross-site scripting (XSS) attacks. This header has been deprecated by modern browsers and its use can introduce additional security issues on the client side. As such, it is recommended to set the header as X-XSS-Protection: 0 in order to disable the XSS Auditor, and not allow it to take the default behavior of the browser handling the response. */

    app.use(helmet.xssFilter());

    /*X-Powered-By: X-Powered-By header is used to inform what technology is used in the server side. This is an unnecessary header causing information leakage, so it should be removed from your application. To do so, you can use the hidePoweredBy as follows: */
    app.use(helmet.hidePoweredBy());
};
