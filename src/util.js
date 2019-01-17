export function publishedPostData(data, postId) {
  const posts = data.userById.posts;
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === postId) {
      posts[i].published = true;
    }
  }
  data.userById.posts = posts;
  return data;
}
