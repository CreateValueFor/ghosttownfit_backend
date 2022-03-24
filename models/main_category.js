const Sequelize = require('sequelize')

module.exports = class MainCategory extends Sequelize.Model {
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
            modelName: "MainCategory",
            tableName: "gt_main_categories",
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {
        db.MainCategory.hasMany(db.SubCategory, { foreignKey: "mainCategoryId", sourceKey: 'id' })

    }
}