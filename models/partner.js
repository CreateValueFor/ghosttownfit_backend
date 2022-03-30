const Sequelize = require('sequelize')

module.exports = class Partner extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            role: {
                type: Sequelize.STRING(200),
                allowNull: false
            },

            contents: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            image: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            instagram: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            youtube: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            flag: {
                type: Sequelize.TINYINT,
                defaultValue: 1
            },
        }, {
            sequelize,
            timestamps: false,
            modelName: "Partner",
            tableName: "gt_partners",
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {

    }
}