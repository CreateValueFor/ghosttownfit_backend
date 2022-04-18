const Sequelize = require('sequelize')


// 보류
module.exports = class Coupon extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            discountType: {
                type: Sequelize.STRING(20),
                allowNull: false
            },

            userid: {
                type: Sequelize.STRING(200),
                allowNull: true,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },

        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: "Coupon",
            tableName: "gt_coupons",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {

        db.User.hasMany(db.Inquiry, { foreignKey: "inquirer", sourceKey: 'id' })
        db.User.hasOne(db.Token, { foreignKey: "userId", sourceKey: 'id' })
    }
}