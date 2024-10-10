const _ = require('lodash');

class CategoryRepository {
  constructor({ prisma }) {
    this.prisma = prisma;
  }

  async save(categoryData) {
    const data = _.omit(categoryData, []); // Params [] digunakan untuk menghilangkan properti
    
    try {
      const newCategory = await this.prisma.category.create({
        data,
      });
      return newCategory;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });
      return category;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findBySlug(slug) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { slug },
      });
      return category;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.category.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async update(id, categoryData) {
    const data = _.omit(categoryData, []);
    
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data,
      });
      return category;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

module.exports = CategoryRepository;
