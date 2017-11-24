function assignRouteDynamicaly (app, routers, previousEndpoint = '/') {
  Object.keys(routers).forEach(endpoint => {
    const router = routers[endpoint];
    if (!Array.isArray() && typeof router === 'object') {
      return assignRouteDynamicaly(app, router, endpoint);
    }
    return app.use(`/${previousEndpoint}`, router);
  });
}

module.exports = {
  assignRouteDynamicaly,
};
