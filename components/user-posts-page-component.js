import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, newLikePosts, getToken } from "../index.js";
import { addLike, getPosts, removeLike } from "../api.js";

export function renderUserPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api (ГОТОВО)
  console.log("Актуальный список постов пользователя:", posts);

  const appUserPosts = posts.map((post) => {
    return {
      description: post.description,
      imageUrl: post.imageUrl,
      userName: post.user.name,
      userId: post.user.id,
      userImageUrl: post.user.imageUrl,
      userLogin: post.user.login,
      date: post.createdAt,
      like: post.isLiked,
      likes: post.likes,
      id: post.id,
    }
  })

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  const appUserPostsHtml = appUserPosts.map((element, index) => {
    return `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        <li class="post" data-index=${index}>
          <div class="post-header" data-user-id="${element.userId}">
              <img src="${element.userImageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${element.userName}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${element.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${element.id}" data-like="${element.like}" class="like-button">
              <img src="${element.like ? "./assets/images/like-active.svg" : "./assets/images/like-not-active.svg"}">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${element.likes[element.likes.length - 1].name} и еще ${element.likes.length - 1}</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${element.userName}</span>
            ${element.description}
          </p>
          <p class="post-date">
            ${element.date}
          </p>
        </li>                  
      </ul>
    </div>`
  });

  appEl.innerHTML = appUserPostsHtml;

  console.log(appEl.innerHTML);

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let likeEl of document.querySelectorAll(".like-button")) {
    likeEl.addEventListener("click", () => {

      if (likeEl.dataset.like === "false") {
        addLike({
          token: getToken(),
          postId: likeEl.dataset.postId,
        })
        .then((responseData) => {
          console.log(responseData);

          return getPosts( {token: getToken()} );
        })
        .then(() => {
          for (let userEl of document.querySelectorAll(".post-header")) {
            newLikePosts(USER_POSTS_PAGE, {
            userId: userEl.dataset.userId,
            });
          }
        })
        .catch((error) => {
          console.warn(error);
          alert(error);
        });
      }
      else if(likeEl.dataset.like === "true") {
        removeLike({
          token: getToken(),
          postId: likeEl.dataset.postId,
        })
        .then((responseData) => {
          console.log(responseData);

          return getPosts( {token: getToken()} );
        })
        .then(() => {
          for (let userEl of document.querySelectorAll(".post-header")) {
            newLikePosts(USER_POSTS_PAGE, {
            userId: userEl.dataset.userId,
            });
          }
        })
        .catch((error) => {
          console.warn(error);
          alert(error);
        });
      }

    })
  }
}
