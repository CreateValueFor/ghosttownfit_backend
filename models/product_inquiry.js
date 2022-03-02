const Sequelize = require('sequelize')

module.exports = class ProductInquiry extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            contents: {
                type: Sequelize.TEXT,
            },
            isPrivate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            reply: {
                type: Sequelize.TEXT,
            },
            flag: {
                type: Sequelize.TINYINT,
                defaultValue: 1
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: "ProductInquiry",
            tableName: "gt_product_inquiries",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {
        db.ProductInquiry.belongsTo(db.Product, { foreignKey: "productId", targetKey: 'id' })
        db.ProductInquiry.belongsTo(db.User, { foreignKey: "inquirer", targetKey: 'id' })
    }
}