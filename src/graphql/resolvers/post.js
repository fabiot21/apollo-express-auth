export default {
  Query: {
    getPosts: async (_, { skip, limit }, { Post }) => {
      const posts = await Post.find()
        .skip((skip - 1) * limit)
        .limit(limit);
      return posts;
    },

    getPost: async (_, { id }, { Post }) => {
      return Post.findById(id);
    },
  },

  Mutation: {
    createPost: async (_, { postInput }, { Post }) => {
      const { title, content } = postInput;
      const post = new Post({ title, content });
      const resultPost = await post.save();
      return {
        id: resultPost._id,
        title: resultPost.title,
        content: resultPost.content,
      };
    },

    editPost: async (_, { postInput, id }, { Post }) => {
      const { title, content } = postInput;
      const post = await Post.findById(id);

      post.title = title || post.title;
      post.content = content || post.content;
      const resultPost = await post.save();

      return {
        id: resultPost._id,
        title: resultPost.title,
        content: resultPost.content,
      };
    },
  },
};
