<template>
<div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Id
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Id
                </th>
              </tr>
            </thead>

            <tbody class="bg-white divide-y divide-gray-200">

              <tr  v-for="post in posts" :key="post.userId">
               <td class="px-6 py-4 whitespace-nowrap">
                  <div id="app">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full" src="../assets/image.jpeg" alt="" />
                      </div>
                       <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ currentUser.username }}
                      </div>
                    </div>

                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <ul>
                    <li>{{ post.content }}</li>
                  </ul>
                </td>

               <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      <p class="username">{{ currentUser.id }}</p>
                  </span>
                </td>

               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <p>{{ post.id }}</p>
                </td>
              </tr>

              <tr>
               <td class="px-6 py-4 whitespace-nowrap">
                  <div id="app">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full" src="../assets/image1.jpeg" alt="" />
                      </div>
                       <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ otherUser.username }}
                      </div>
                    </div>

                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <ul>
                    <li v-for="post in otherposts" :key="post.id">{{ post.content }}</li>
                  </ul>
                </td>

               <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      <p class="username">{{ otherUser.id }}</p>
                  </span>
                </td>

               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <p v-for="post in otherposts" :key="post.userId">{{ post.id }}</p>
                </td>
              </tr>

              <tr>
               <td class="px-6 py-4 whitespace-nowrap">
                  <div id="app">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full" src="../assets/image2.jpeg" alt="" />
                      </div>
                       <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ nextUser.username }}
                      </div>
                    </div>

                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <ul>
                    <li v-for="post in nextposts" :key="post.id">{{ post.content }}</li>
                  </ul>
                </td>

               <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      <p class="username">{{ nextUser.id }}</p>
                  </span>
                </td>

               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <p v-for="post in nextposts" :key="post.id">{{ post.id }}</p>
                </td>
              </tr>


            </tbody>
          </table>
        </div>
      </div>

      <form class="w-screen max-w-sm mx-auto">
        <div class="flex items-center border-b py-2">
          <input class="appearance-none bg-transparent border-none w-full text-gray-700 mr-0 py-1 px-2 leading-tight focus:outline-none" placeholder="Add New Post" v-model="newPostContent">
          <button class="flex-shrink-0 text-sm border-4 py-1 px-2 rounded" @click="addPost()">
            Add Post
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";

const OTHER_USER = gql`
  query {
    otherUser {
      id
      username
    }
  }
`;

const NEXT_USER = gql`
  query {
    nextUser {
      id
      username
    }
  }
`;

const CURRENT_USER = gql`
  query {
    currentUser {
      id
      username
    }
  }
`;

const POSTS_BY_USER = gql`
  query($userId: String!) {
    postsByUser(userId: $userId) {
      id
      content
      userId
    }
  }
`;

const ADD_POST = gql`
  mutation($content: String!) {
    addPost(content: $content) {
      id
      content
    }
  }
`;

function updateAddPost(cache, result) {
  let newPost = result.data.addPost;

  console.log(newPost.id);

  let cacheId = {
    query: POSTS_BY_USER,
    variables: { userId: this.userId.id }
  };

  const data = cache.readQuery(cacheId);
  const newData = [...data.postsByUser, newPost];

  cache.writeQuery({
    ...cacheId,
    data: { postsByUser: newData }
  });
}

export default {
  name: "app",
  data: function() {
    return {
      otherUser: { username: "user" },
      nextUser: { username: "user" },
      currentUser: { username: "user" },
      posts: [],
      newPostContent: ""
    };
  },

  methods: {
    addPost() {
      this.$apollo.mutate({
        mutation: ADD_POST,
        variables: { content: this.newPostContent },
        update: updateAddPost.bind(this),

        // NEW
        optimisticResponse: {
          __typename: "Mutation",
          addPost: {
            __typename: "Post",
            id: "xyz-?",
            content: this.newPostContent,
            userId: this.currentUser.id
          }
        }
      });

      this.newPostContent = "";
    }
  },

  apollo: {
    otherUser: OTHER_USER,
    nextUser: NEXT_USER,
    currentUser: CURRENT_USER,
    posts: {
      query: POSTS_BY_USER,
      variables() {
        return {
          userId: String(this.currentUser.id)
        };
      },
      update(data) {
        return data.postsByUser;
      }
    },
    otherposts: {
      query: POSTS_BY_USER,
      variables() {
        return {
          userId: String(this.otherUser.id)
        };
      },
      update(data) {
        return data.postsByUser;
      }
    } ,
    nextposts: {
      query: POSTS_BY_USER,
      variables() {
        return {
          userId: String(this.nextUser.id)
        };
      },
      update(data) {
        return data.postsByUser;
      }
    }
  }
};
</script>
