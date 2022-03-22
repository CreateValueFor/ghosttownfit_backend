const Sequelize = require('sequelize')

module.exports = class Inquiry extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
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
            modelName: "Inquiry",
            tableName: "gt_inquiries",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {
        db.Inquiry.belongsTo(db.User, { foreignKey: "inquirer", targetKey: 'id' })
    }
}