const Sequelize = require('sequelize')

module.exports = class ProductInventory extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            size: {
                type: Sequelize.TEXT,
                allowNull: false,
                defaultValue: ''
            },
            inventory: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            status: {
                type: Sequelize.STRING(20),
                allowNull: false,
                defaultValue: '판매중'
            }
        }, {
            sequelize,
            timestamps: true,
            modelName: "ProductInventory",
            tableName: "gt_product_inventory",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {
        db.ProductInventory.belongsTo(db.ProductColor, { foreignKey: "productColorId", targetKey: 'id' })
    }
}