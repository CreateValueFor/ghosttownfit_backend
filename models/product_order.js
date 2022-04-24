const Sequelize = require('sequelize')

module.exports = class ProductOrder extends Sequelize.Model {
    static init(sequelize) {
        return super.init({

            count: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            OrderId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            ProductColorSizeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,

            modelName: "ProductOrder",
            tableName: "gt_product_orders",
            paranoid: true,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {

    }
}

// const ProductOrder = Sequelize.define("gt_product_orders", {
//     count: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//     },
// },
//     {
//         timestamps: false
//     }
// )

// module.exports = ProductOrder