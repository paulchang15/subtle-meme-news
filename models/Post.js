const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// create our Post model
class Post extends Model {
  static upvote(body, models) {
    return models.Vote.create({
      user_id: body.user_id,
      post_id: body.post_id,
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.post_id,
        },
        attributes: [
          "id",
          "post_url",
          "title",
          "created_at",
          // [
          //   sequelize.literal(
          //     "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
          //   ),
          //   "vote_count",
          // ],
        ],
        include: [
          {
            model: models.Comment,
            attributes: [
              "id",
              "comment_text",
              "post_id",
              "user_id",
              "created_at",
            ],
            include: {
              model: models.User,
              attributes: ["username"],
            },
          },
        ],
      });
    });
  }
}

// create fields/columns for Post model
Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isURL: true,
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "post",
    // hooks: {
    //   beforeDestroy(post, options) {
    //     console.log(post.id);
    //     return new Promise(function (resolve, reject) {
    //       sequelize
    //         .query("DELETE FROM comment WHERE post_id = :post_id", {
    //           replacements: { post_id: post.id },
    //         })
    //         .then((results) => {
    //           sequelize.query("DELETE FROM vote WHERE post_id = :post_id", {
    //             replacements: { post_id: post.id },
    //           });
    //         })
    //         .then((results) => {
    //           resolve();
    //         })
    //         .catch((err) => {
    //           reject(err);
    //         });
    //     });
    //     // Comment.findAll({
    //     //   where: {
    //     //     post_id: req.params.id,
    //     //   },
    //     // }).then((data) => {
    //     //   data.forEach((comment) => {
    //     //     console.log(data.commentValues);
    //     //   });
    //     //   Comment.destroy({
    //     //     id: parseInt(data.id),
    //     //   });

    //     //   Vote.findAll({
    //     //     where: {
    //     //       post_id: req.params.id,
    //     //     },
    //     //   }).then((data) => {
    //     //     console.log(data);
    //     //     const id = data.split("");
    //     //     Vote.destroy({
    //     //       id: parseInt(data),
    //     //     });
    //     //   });
    //     // });
    //   },
    // },
  }
);

module.exports = Post;
