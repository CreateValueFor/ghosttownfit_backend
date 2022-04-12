const Sequelize = require('sequelize')

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            userid: {
                type: Sequelize.STRING(200),
                allowNull: true,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            name: {
                type: Sequelize.STRING(200),
                allowNull: false,
                // defaultValue: ""
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING(200),
                allowNull: true,
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
            },
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true
            },
            smsAgree: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            emailAgree: {
                type: Sequelize.BOOLEAN,
                allowNull: false
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
        db.User.hasOne(db.Token, { foreignKey: "userId", sourceKey: 'id' })
    }
}