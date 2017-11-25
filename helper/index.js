/**
 * This function automates the assign of new functions based on the
 * folder structure of the /routes directory
 * @param  {Object} app                    Express app instance
 * @param  {Function} routers              Router function at the end of folder branch
 * @param  {String} [previousEndpoint='/'] Endpoint of previous branch
 */
function assignEndpointRoutersDynamicaly (app, routers, previousEndpoint = '/') {
  Object.keys(routers).forEach(endpoint => {
    const router = routers[endpoint];
    if (!Array.isArray() && typeof router === 'object') {
      return assignEndpointRoutersDynamicaly(app, router, endpoint);
    }
    return app.use(`/${previousEndpoint}`, router);
  });
}

module.exports = {
  assignEndpointRoutersDynamicaly,
};
