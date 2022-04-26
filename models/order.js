const Sequelize = require('sequelize')
const ProductOrder = require("./product_order")

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({

            serialNumber: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },

            receiver: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            name: {
                type: Sequelize.STRING(200),

            },
            thumb: {
                type: Sequelize.STRING(200),

            },
            colorId: {
                type: Sequelize.INTEGER,

            },
            address1: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            address2: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            postCode: {
                type: Sequelize.STRING(10),
                allowNull: false
            },
            deliveryMessage: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            status: {
                type: Sequelize.TINYINT,
                defaultValue: 0
            },
            eachAmount: {
                type: Sequelize.INTEGER,

                defaultValue: 0
            },
            count: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            purchaseAmount: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            purchaseMethod: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            discount: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            }


        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: "Order",
            tableName: "gt_orders",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {
        db.Order.belongsTo(db.User, { foreignKey: "buyer", sourceKey: 'id' })
        db.Order.belongsToMany(db.ProductColorSize, { through: ProductOrder })
    }
}