const Sequelize = require('sequelize')

module.exports = class SubCategory extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true
            },
        }, {
            sequelize,
            timestamps: false,
            modelName: "SubCategory",
            tableName: "gt_sub_categories",
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {
        db.SubCategory.belongsTo(db.MainCategory, { foreignKey: "mainCategoryId", targetKey: 'id' })
        db.SubCategory.hasMany(db.Product, { foreignKey: "categoryId", sourceKey: 'id' })
    }
}