const { createContainer } = require('awilix');
const registerDependencies = require('./registerDependencies');

const container = createContainer();
registerDependencies(container);

module.exports = container;
