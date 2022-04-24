const Sequelize = require('sequelize')

module.exports = class ProductColor extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            detail: {
                type: Sequelize.TEXT,
                allowNull: true,
                defaultValue: ''
            },
            thumb: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            discount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            new: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            saleCount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            salePercent: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            }

        }, {
            sequelize,
            timestamps: true,
            modelName: "ProductColor",
            tableName: "gt_product_colors",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {
        // db.Product.hasMany(db.ProductDetail, { foreignKey: "productId", sourceKey: 'id' })
        db.ProductColor.hasMany(db.ProductDisplay, { foreignKey: "productColorId", sourceKey: 'id' })
        db.ProductColor.hasMany(db.ProductImage, { foreignKey: "productColorId", sourceKey: 'id' })
        db.ProductColor.hasMany(db.ProductColorSize, { foreignKey: "productColorId", sourceKey: 'id' })
        db.ProductColor.belongsTo(db.Product, { foreignKey: "productId", targetKey: 'id', onDelete: 'cascade' })

    }
}