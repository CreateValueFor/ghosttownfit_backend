const Sequelize = require('sequelize')

module.exports = class LookBook extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            image: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            season: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            modelName: "LookBook",
            tableName: "gt_lookbooks",
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {
    }
}