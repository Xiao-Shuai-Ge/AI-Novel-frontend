<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <nav class="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
      <div
          class="w-full mx-auto px-10 flex items-center justify-between h-full"
      >
        <div class="flex items-center">
          <span class="text-xl font-bold text-blue-500">AI小说</span>
          <span class="text-xl font-bold text-gray-800">创作平台</span>
        </div>

        <div class="flex items-center space-x-6">
          <button
              class="!rounded-button whitespace-nowrap flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white cursor-pointer"
          >
            <el-icon><Edit /></el-icon>
            <span>创作</span>
          </button>

          <el-avatar :size="32" class="cursor-pointer">
            <img
                :src="userAvatarUrl"
            />
          </el-avatar>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 pt-24 pb-12">
      <!-- 筛选区域 -->
      <div class="mb-8">
        <div class="flex items-center space-x-8 mb-6">
          <button
              v-for="tab in tabs"
              :key="tab.value"
              class="!rounded-button whitespace-nowrap text-lg font-medium cursor-pointer"
              :class="currentTab === tab.value ? 'text-blue-600' : 'text-gray-600'"
              @click="currentTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>

      </div>

      <!-- 内容展示区域 -->
      <div class="grid grid-cols-4 gap-6">
        <div
            v-for="novel in novels"
            :key="novel.id"
            class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer overflow-hidden"
        >
          <div class="aspect-w-3 aspect-h-4 overflow-hidden">
            <img
                :src="novel.cover"
                class="w-full h-full object-cover object-top"
                alt="novel cover"
            />
          </div>

          <div class="p-4">
            <h3 class="text-lg font-bold mb-2 line-clamp-1">
              {{ novel.title }}
            </h3>

            <div class="flex items-center space-x-2 mb-3">
              <el-avatar :size="24">
                <img :src="novel.authorAvatar" />
              </el-avatar>
              <span class="text-sm text-gray-600">{{ novel.author }}</span>
            </div>

            <p class="text-sm text-gray-500 line-clamp-2">
              {{ novel.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import { Edit, Search, ArrowDown } from "@element-plus/icons-vue";
import {get_user_self} from "@/api/user";
import {useUserStore} from "@/store/user";

const UserStore = useUserStore();

const currentTab = ref("all");

const tabs = [
  { label: "全部作品", value: "all" },
  { label: "我的作品", value: "my" },
];

const filters = ref([
  {
    key: "category",
    label: "分类",
    isOpen: false,
    options: [
      { label: "全部", value: "all" },
      { label: "玄幻", value: "fantasy" },
      { label: "科幻", value: "science" },
      { label: "都市", value: "urban" },
    ],
  },
  {
    key: "status",
    label: "状态",
    isOpen: false,
    options: [
      { label: "全部", value: "all" },
      { label: "连载中", value: "ongoing" },
      { label: "已完结", value: "finished" },
    ],
  },
  {
    key: "sort",
    label: "排序",
    isOpen: false,
    options: [
      { label: "最新发布", value: "newest" },
      { label: "最多阅读", value: "most_read" },
      { label: "最多收藏", value: "most_favorite" },
    ],
  },
]);

const novels = ref([
  {
    id: 1,
    title: "星际迷航：永恒之旅",
    author: "张三",
    authorAvatar:
        "https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20asian%20man%20with%20simple%20clean%20background%2C%20high%20quality%2C%208k%2C%20professional%20lighting&width=100&height=100&seq=2&orientation=squarish",
    cover:
        "https://readdy.ai/api/search-image?query=science%20fiction%20book%20cover%20with%20spaceship%20and%20stars%2C%20professional%20design%2C%20high%20quality%20digital%20art%2C%20simple%20clean%20background&width=300&height=400&seq=3&orientation=portrait",
    description:
        '在浩瀚的宇宙中，一艘名为"永恒号"的星际飞船正在执行一项神秘的任务。船长李明带领着他的精英船员，穿越时空探索未知的星系。',
  },
  {
    id: 2,
    title: "都市之巅",
    author: "李四",
    authorAvatar:
        "https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20asian%20man%20with%20simple%20clean%20background%2C%20high%20quality%2C%208k%2C%20professional%20lighting&width=100&height=100&seq=4&orientation=squarish",
    cover:
        "https://readdy.ai/api/search-image?query=modern%20city%20skyline%20at%20night%20with%20dramatic%20lighting%2C%20professional%20book%20cover%20design%2C%20simple%20clean%20background&width=300&height=400&seq=5&orientation=portrait",
    description: "一个普通白领的奋斗史，从平凡到传奇，演绎一段都市励志传说。",
  },
  {
    id: 3,
    title: "玄天剑道",
    author: "王五",
    authorAvatar:
        "https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20asian%20man%20with%20simple%20clean%20background%2C%20high%20quality%2C%208k%2C%20professional%20lighting&width=100&height=100&seq=6&orientation=squarish",
    cover:
        "https://readdy.ai/api/search-image?query=ancient%20chinese%20martial%20arts%20scene%20with%20sword%20and%20mountains%2C%20fantasy%20book%20cover%2C%20professional%20design%2C%20simple%20clean%20background&width=300&height=400&seq=7&orientation=portrait",
    description:
        "修真世界中的一段传奇，主角从默默无闻的小修士成长为举世瞩目的剑道大能。",
  },
  {
    id: 4,
    title: "未来战场",
    author: "赵六",
    authorAvatar:
        "https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20asian%20man%20with%20simple%20clean%20background%2C%20high%20quality%2C%208k%2C%20professional%20lighting&width=100&height=100&seq=8&orientation=squarish",
    cover:
        "https://readdy.ai/api/search-image?query=futuristic%20battlefield%20with%20advanced%20weapons%20and%20soldiers%2C%20sci-fi%20book%20cover%2C%20professional%20design%2C%20simple%20clean%20background&width=300&height=400&seq=9&orientation=portrait",
    description:
        "在2150年的未来战场上，人类与人工智能展开了一场惊心动魄的较量。",
  },
]);

const selectFilter = (key: string, value: string) => {
  const filter = filters.value.find((f) => f.key === key);
  if (filter) {
    filter.isOpen = false;
  }
};

// 用户信息
const myID = ref("");
const userName = ref("");
const userAvatarUrl = ref(
    "/assets/not_logged_in.png",
);

onMounted(async () => {
  // 判断用户是否登录
  if (UserStore.isLogin()) {
    // 先读取本地
    const localData = UserStore.getUserInfo();
    myID.value = localData.user_id;
    userName.value = localData.username;
    userAvatarUrl.value = localData.avatar;

    // 从服务器获取用户信息
    let data;
    try {
      data = await get_user_self();
      console.log(data);
    } catch (error) {
      console.log("用户未登录");
      userName.value = ""
      userAvatarUrl.value = "/assets/not_logged_in.png";
      return;
    }
    myID.value = data.data.id;
    userName.value = data.data.username;
    if (data.data.avatar.length > 0) {
      userAvatarUrl.value = data.data.avatar;
    } else {
      console.log("用户头像为空");
      userAvatarUrl.value = "/assets/default_avatar.png";
    }
    // 保存到本地
    UserStore.setUserInfo({
      user_id : myID.value,
      username : userName.value,
      avatar : userAvatarUrl.value,
    });
  } else {
    console.log("用户未登录");
    userName.value = ""
    userAvatarUrl.value = "/assets/not_logged_in.png";
  }
})
</script>

<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
