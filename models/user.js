const Sequelize = require('sequelize')

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            userid: {
                type: Sequelize.STRING(200),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            point: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            level: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            flag: {
                type: Sequelize.TINYINT,
                defaultValue: 1
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: "User",
            tableName: "gt_users",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {

        db.User.hasMany(db.Inquiry, { foreignKey: "inquirer", sourceKey: 'id' })
    }
}