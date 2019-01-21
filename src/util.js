export function publishedPostData(data, postId) {
  const posts = data.userPostsById.posts;
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === postId) {
      posts[i].published = true;
    }
  }
  data.userPostsById.posts = posts;
  return data;
}
