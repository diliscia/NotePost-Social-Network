module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define("Comments", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {         // Comment done by a User
                model: 'Users',
                key: 'id'
            }
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {         // Comment belongsTo Post
                model: 'Posts',
                key: 'id'
            }
        },
        commentText: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
    })
    return Comments
}