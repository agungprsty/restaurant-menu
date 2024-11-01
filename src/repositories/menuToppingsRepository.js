const _ = require('lodash');

class MenuToppingsRepository {
  constructor({ prisma }) {
    this.prisma = prisma;
  }

  async save(menutoppingsData) {
    const data = _.omit(menutoppingsData, []); // Params [] digunakan untuk menghilangkan properti

    try {
      const newTopping = await this.prisma.menuToppings.create({
        data,
      });
      return newTopping;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findByMenuIdAndToppingId(menuId, toppingId) {
    try {
      return this.prisma.menuToppings.findFirst({
        where: { menuId, toppingId },
      });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findToppingsByMenuId(menuId) {
    try {
      return this.prisma.menuToppings.findMany({
        where: { menuId },
        include: {
          topping: true,
        },
      });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

module.exports = MenuToppingsRepository;
