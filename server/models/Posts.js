module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define("Posts", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {         // Post belongsTo User
                model: 'Users',
                key: 'id'
            }
        },
        postText: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        postImage: {
            type: DataTypes.STRING(100)
        }
    })
    return Posts
}