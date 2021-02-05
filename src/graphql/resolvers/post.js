export default {
  Query: {
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
  },
};
