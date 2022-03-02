const Sequelize = require('sequelize')

module.exports = class Calendar extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            start: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            end: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            modelName: "Calendar",
            tableName: "gt_calendars",
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {
    }
}