const routes = require('next-routes')();

routes
  .add('/campaigns/detail/:address', '/campaigns/detail_campaign')
  .add('/campaigns/new', '/campaigns/new_campaign')
  .add('/campaigns/:address/requests', '/campaigns/requests/request_list')
  .add('/campaigns/:address/requests/new', '/campaigns/requests/request_new');

module.exports = routes;
