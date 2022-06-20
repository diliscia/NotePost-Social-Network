module.exports = (sequelize, DataTypes) => {
    const Friends = sequelize.define("Friends", {
        user1Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {         // first user of fiendship
                model: 'Users',
                key: 'id'
            }
        },
        user2Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {         // second user of fiendship
                model: 'Users',
                key: 'id'
            }
        },
    })
    return Friends
}