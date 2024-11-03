const _ = require('lodash');

class MenuRepository {
  constructor({ prisma }) {
    this.prisma = prisma;
  }

  async save(menuData) {
    const data = _.omit(menuData, []); // Params [] digunakan untuk menghilangkan properti

    try {
      const newMenu = await this.prisma.menu.create({
        data,
      });
      return newMenu;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const menu = await this.prisma.menu.findUnique({
        where: { id },
      });
      return menu;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findBySlug(slug) {
    try {
      const menu = await this.prisma.menu.findUnique({
        where: { slug },
      });
      return menu;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.menu.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async update(id, menuData) {
    const data = _.omit(menuData, []);
    
    try {
      const menu = await this.prisma.menu.update({
        where: { id },
        data,
      });
      return menu;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      await this.prisma.menu.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findByCategoryId(categoryId) {
    try {
      return this.prisma.menu.findMany({
        where: { categoryId },
      });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

module.exports = MenuRepository;
