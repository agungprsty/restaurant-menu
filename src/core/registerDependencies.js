const { asClass, asValue } = require('awilix');
const { PrismaClient } = require('@prisma/client');
const CategoryRepository = require('../repositories/categoryRepository');
const MenuRepository = require('../repositories/menuRepository');
const ToppingRepository = require('../repositories/toppingRepository');
const MenuToppingsRepository = require('../repositories/menuToppingsRepository');
const CategoryHandler = require('../handlers/categoryHandler');
const MenuHandler = require('../handlers/menuHandler');
const ToppingHandler = require('../handlers/toppingHandler');

const registerDependencies = (container) => {
  container
    .register({
      prisma: asValue(new PrismaClient()),
      
      // Respositories
      categoryRepository: asClass(CategoryRepository).singleton(),
      menuRepository: asClass(MenuRepository).singleton(),
      toppingRepository: asClass(ToppingRepository).singleton(),
      menuToppingsRepository: asClass(MenuToppingsRepository).singleton(),
      
      // Handlers
      categoryHandler: asClass(CategoryHandler).singleton(),
      menuHandler: asClass(MenuHandler).singleton(),
      toppingHandler: asClass(ToppingHandler).singleton(),
    });
};

module.exports = registerDependencies;
