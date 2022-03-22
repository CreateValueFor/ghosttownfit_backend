const Sequelize = require('sequelize')

module.exports = class Token extends Sequelize.Model {
    static init(sequelize) {
        return super.init({



            refreshToken: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },

        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: "Token",
            tableName: "gt_tokens",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {

        db.Token.belongsTo(db.User, { foreignKey: "userId", targetKey: 'id' })
    }
}