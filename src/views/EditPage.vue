<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <nav
        class="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50 flex items-center px-6"
    >
      <div class="flex items-center gap-4">
        <el-icon size="20"
          class="cursor-pointer"
          @click="console.log('返回上一页')"
        ><ArrowLeftBold /></el-icon>
        <h1 class="text-lg font-medium">我的小说</h1>
      </div>
      <div class="flex items-center gap-4 mx-auto">
        <button
            class="flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer bg-blue-600 text-white"
            @click="handleSave"
        >
          <el-icon><Document /></el-icon>
          保存
        </button>
        <button
            class="flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer bg-red-600 text-white"
            @click="handleDelete"
        >
          <el-icon><Delete /></el-icon>
          删除
        </button>
      </div>
      <div class="flex items-center gap-4">
        <el-icon class="text-xl cursor-pointer"><Setting /></el-icon>
        <div
            class="w-8 h-8 rounded-full bg-cover cursor-pointer"
            :style="{ backgroundImage: `url(${avatarUrl})` }"
        ></div>
      </div>
    </nav>

    <!-- 主体内容 -->
    <div class="pt-16 flex h-screen">
      <!-- 左侧菜单 -->
      <div class="flex-col h-full">
        <!-- 左侧角色 -->
        <div class="w-64 border-r border-b border-gray-200 bg-white p-4 h-1/4">
          <div class="h-1/6 flex items-center justify-between mb-4 border-b pb-2 border-gray-200">
            <h2 class="font-medium">角色列表</h2>
            <el-icon class="cursor-pointer"
                     @click="createCharacter"
            ><Plus /></el-icon>
          </div>
          <div class="h-5/6 overflow-y-auto">
            <div
                v-for="(character, index) in characters"
                :key="index"
                :class="{'bg-blue-50': selected.id === character.id}"
                class="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50"
                @click="selectCharacter(character.id)"
            >
              <!--          <el-icon><Document /></el-icon>-->
<!--              <span class="text-gray-600 text-sm">第{{ index+1 }}章</span>-->
              <el-icon><User /></el-icon>
              <span>{{ character.name }}</span>
              <i v-if="selected.id === character.id && IsChanged" class="fa-solid fa-circle save-icon text-yellow-300"></i>
            </div>
          </div>
        </div>
        <!-- 左侧章节 -->
        <div class="w-64 border-r border-gray-200 bg-white p-4 overflow-y-auto h-3/4">
          <div class="flex items-center justify-between mb-4 border-b pb-2 border-gray-200">
            <h2 class="font-medium">章节列表</h2>
            <el-icon class="cursor-pointer"
                     @click="createChapter"
            ><Plus /></el-icon>
          </div>
          <div
              v-for="(chapter, index) in chapters"
              :key="index"
              :class="{'bg-blue-50': selected.id === chapter.id}"
              class="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50"
              @click="selectChapter(chapter.id)"
          >
            <!--          <el-icon><Document /></el-icon>-->
            <span class="text-gray-600 text-sm">第{{ index+1 }}章</span>
            <span>{{ chapter.title }}</span>
            <i v-if="selected.id === chapter.id && IsChanged" class="fa-solid fa-circle save-icon text-yellow-300"></i>
          </div>
        </div>
      </div>


      <!-- 中间编辑区 -->
      <div v-if="selected.type === 'chapter'" class="flex-1 max-h-screen overflow-y-auto">
        <!-- 篇章编辑器 -->
        <div class="p-8 overflow-y-auto" ref="editorContainer">
          <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <input
                v-model="title"
                class="w-full text-3xl font-medium mb-8 border-none outline-none"
                placeholder="请输入标题..."
            />
            <div
                contenteditable="true"
                class="prose space-y-2"
                style="line-height: 1.5;"
                @paste="handlePaste"
                @mouseup="handleTextSelection"
                @input="handleContentChange"
                ref="contentEditable"

            >
            </div>
          </div>

          <!-- 选中文本工具栏 -->
          <div
              class="fixed bg-white shadow-lg rounded-lg py-2 px-4 flex items-center gap-4 transition-opacity duration-300"
              :class="{
              'opacity-100': showToolbar,
              'opacity-0': !showToolbar
            }"
              :style="{ top: toolbarPosition.top + 'px', left: toolbarPosition.left + 'px' }"
          >
            <el-icon class="cursor-pointer" @click="copyText"
            ><CopyDocument
            /></el-icon>
          </div>
        </div>
        <div class="p-8 overflow-y-auto">
          <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <div class="flex flex-col gap-4">
              <div class="flex">
                <h2 class="font-medium text-lg mr-2">篇章总结</h2>
                <div v-if="summaryDisabled">
                  <el-button
                      type="info"
                      disabled
                  >
                    <span class="mr-2">生成中</span>
                    <el-icon><Loading /></el-icon>
                  </el-button>
                </div>
                <div v-else>
                  <el-button
                      type="primary"
                      @click="AIChapterSummary"
                  >
                    <span class="mr-2">AI生成</span>
                    <el-icon><MagicStick /></el-icon>
                  </el-button>
                </div>
              </div>
              <div>
                <el-input
                    v-model="summary"
                    :disabled="summaryDisabled"
                    :rows="4"
                    type="textarea"
                    placeholder="请输入小说总结..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- 右侧工具栏 -->
      <div class="w-64 border-l border-gray-200 bg-white p-4">
        <div class="space-y-4">
          <button
              class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer"
          >
<!--            <el-icon><Magic /></el-icon>-->
            AI 扩写
          </button>

          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-medium mb-2">字数统计</h3>
            <div class="text-sm text-gray-600">
              当前章节：{{ wordCount }} 字
            </div>
<!--            <div>-->
<!--              {{ content }}-->
<!--            </div>-->
          </div>

          <div class="space-y-2">
            <div
                class="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50"
            >
              <el-icon><Reading /></el-icon>
              <span>写作建议</span>
            </div>
            <div
                class="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50"
            >
              <el-icon><Share /></el-icon>
              <span>分享</span>
            </div>
            <div
                class="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50"
            >
              <el-icon><Monitor /></el-icon>
              <span>全屏模式</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted, watch, onUnmounted} from "vue";
import {
  Edit,
  Document,
  View,
  Share,
  Setting,
  Plus,
  CopyDocument,
  Reading,
  Monitor, ArrowLeftBold, MagicStick, Delete, UserFilled, User, Loading,
} from "@element-plus/icons-vue";
import {get_chapter_list, get_chapter, update_chapter, create_chapter, delete_chapter ,get_character_list,get_character,create_character,delete_character,update_character} from "@/api/novel";
import {ElMessage} from "element-plus";

// 导入 store
import { useUserStore } from "@/store/user";
import { useRoute } from "vue-router";
import {ai_chapter_summary} from "@/api/ai";
const UserStore = useUserStore();
const route = useRoute()

const avatarUrl = "/assets/default_avatar.png"

const title = ref("无标题小说");
const content = ref("开始写下你的故事...\n这是一位勇士的故事......\n他的名字叫 <小帅哥>");
const summary = ref("小说总结...");
const avatar = ref("");

const oldTitle = ref("");
const oldContent = ref("");
const oldSummary = ref("");
const oldAvatar = ref("");

const showToolbar = ref(false);
const toolbarPosition = ref({ top: 0, left: 0 });
const editorContainer = ref<HTMLElement | null>(null);

const contentEditable = ref<HTMLDivElement | null>(null);

interface Chapter {
  id: string;
  title: string;
}

interface Character {
  id: string;
  name: string;
}

const chapters = ref<Chapter[]>([]);
const characters = ref<Character[]>([]);

// 选择内容
const selected = ref({
  id: "",
  type: "",
})

// 初始化
onMounted( async () => {
  // 获得小说内容
  await updateChaptersList();
  // 读取第一章
  selected.value.id = chapters.value[0].id;
  selected.value.type = "chapter";
  await LoadChapter();

  // 读取角色列表
  await updateCharacterList();

  if (contentEditable.value) {
    //contentEditable.value.innerHTML = content.value;
    contentEditable.value.innerHTML = TransformHtml(content.value);
  }
});

const updateChaptersList = async () => {
  chapters.value = [];
  const novelID = String(route.params.id);
  let data;
  try {
    data = await get_chapter_list({novel_id: novelID})
    console.log(data);
  }  catch (error) {
    ElMessage({
      showClose: true,
      message: error.response.data,
      type: 'error',
    })
  }
  for (let chapter of data.data.list) {
    chapters.value.push({
      id: chapter.id,
      title: chapter.title,
    });
  }
}

const updateCharacterList = async () => {
  characters.value = [];
  const novelID = String(route.params.id);
  let data;
  try {
    data = await get_character_list({novel_id: novelID})
    console.log(data);
  }  catch (error) {
    ElMessage({
      showClose: true,
      message: error.response.data,
      type: 'error',
    })
  }
  for (let character of data.data.list) {
    characters.value.push({
      id: character.id,
      name: character.name,
    });
  }
}

const LoadChapter = async () => {
  // 读取小说章节内容
  let data;
  try {
    data = await get_chapter({id: selected.value.id})
    console.log(data);
  } catch (error) {
    console.log(error);
    ElMessage({
      showClose: true,
      message: error.response.data,
      type: 'error',
    })
  }
  content.value = data.data.chapter.content;
  contentEditable.value.innerHTML = TransformHtml(content.value);
  oldContent.value = content.value;

  title.value = data.data.chapter.title;
  oldTitle.value = title.value;

  summary.value = data.data.chapter.summary;
  oldSummary.value = summary.value;

  avatar.value = "";
  oldAvatar.value = "";
}

const LoadCharacter = async () => {
  // 读取小说角色内容
  let data;
  try {
    data = await get_character({id: selected.value.id})
    console.log(data);
  } catch (error) {
    console.log(error);
    ElMessage({
      showClose: true,
      message: error.response.data,
      type: 'error',
    })
  }
  content.value = ""
  oldContent.value = content.value;

  title.value = data.data.character.name;
  oldTitle.value = title.value;

  summary.value = data.data.character.summary;
  oldSummary.value = summary.value;

  avatar.value = data.data.character.avatar;
  oldAvatar.value = avatar.value;
}

const handleSave = async () => {
  if (selected.value.type === "chapter") {
    // 保存章节内容
    let data;
    try {
      data = await update_chapter({
        id: selected.value.id,
        title: title.value,
        content: content.value,
        summary: summary.value,
      });
      console.log(data);
    } catch (error) {
      ElMessage({
        showClose: true,
        message: error.response.data,
        type: 'error',
      })
      return
    }
    // old 内容更新
    oldContent.value = content.value;
    oldTitle.value = title.value;
    oldSummary.value = summary.value;
    // 保存成功提示
    ElMessage({
      showClose: true,
      message: "保存成功",
      type:'success',
    })
  } else if (selected.value.type === "character") {
    // 保存角色内容
    let data;
    try {
      data = await update_character({
        id: selected.value.id,
        name: title.value,
        summary: summary.value,
        avatar: avatar.value,
      });
      console.log(data);
    } catch (error) {
      ElMessage({
        showClose: true,
        message: error.response.data,
        type: 'error',
      })
      return
    }
    // old 内容更新
    oldTitle.value = title.value;
    oldSummary.value = summary.value;
    oldAvatar.value = avatar.value;
    // 保存成功提示
    ElMessage({
      showClose: true,
      message: "保存成功",
      type:'success',
    })
  }
}

const handleDelete = async () => {
  // 删除章节
  if (selected.value.type === "chapter") {
    const id = selected.value.id;
    let data;
    try {
      data = await delete_chapter({id: id});
      console.log(data);
    } catch (error) {
      ElMessage({
        showClose: true,
        message: error.response.data,
        type: 'error',
      })
      return
    }
    await updateChaptersList();
    if (selected.value.type === "chapter") {
      selected.value.id = chapters.value[0].id;
      selected.value.type = "chapter";
    }
    await LoadChapter();
    ElMessage({
      showClose: true,
      message: "删除成功",
      type:'success',
    })
  } else if (selected.value.type === "character") {
    // 删除角色
    const id = selected.value.id;
    let data;
    try {
      data = await delete_character({id: id});
      console.log(data);
    } catch (error) {
      ElMessage({
        showClose: true,
        message: error.response.data,
        type: 'error',
      })
      return
    }
    await updateCharacterList();
    if (selected.value.type === "character") {
      selected.value.id = characters.value[0].id;
      selected.value.type = "character";
    }
    await LoadCharacter();
    ElMessage({
      showClose: true,
      message: "删除成功",
      type:'success',
    })
  }
}

const createChapter = async () => {
  // 创建新章节
  const novelID = String(route.params.id);
  let data;
  try {
    data = await create_chapter({
      novel_id: novelID,
      title: "新章节",
      content: "请编写你的故事...",
      summary: "",
    });
    console.log(data);
  } catch (error) {
    ElMessage({
      showClose: true,
      message: error.response.data,
      type: 'error',
    })
    return
  }
  selected.value.id = data.data.id;
  selected.value.type = "chapter";
  await updateChaptersList();
  await LoadChapter();
  ElMessage({
    showClose: true,
    message: "创建成功",
    type:'success',
  })
}

const createCharacter = async () => {
  // 创建新角色
  const novelID = String(route.params.id);
  let data;
  try {
    data = await create_character({
      novel_id: novelID,
      name: "新角色",
      summary: "",
      avatar: "",
    });
    console.log(data);
  } catch (error) {
    ElMessage({
      showClose: true,
      message: error.response.data,
      type: 'error',
    })
    return
  }
  selected.value.id = data.data.id;
  selected.value.type = "character";
  await updateCharacterList();
  await LoadCharacter();
  ElMessage({
    showClose: true,
    message: "创建成功",
    type:'success',
  })
}

const summaryDisabled = ref(false);
const AIChapterSummary = async () => {
  const requestBody = {
    title: title.value,
    content: content.value,
  };
  // 清空 summary
  summaryDisabled.value = true;
  summary.value = "";

  try {
    await ai_chapter_summary(requestBody, (data) => {
      summary.value+=data;
      console.log(data);
    });
  } catch (error) {
    ElMessage({
      showClose: true,
      message: error.response.data,
      type: 'error',
    })
    summaryDisabled.value = false;
    return
  }
  summaryDisabled.value = false;
}

// 流式传输测试
// const messages = ref([]);
// let abortController = null;

// onMounted(async () => {
//   const requestBody = {
//     title: "初入魔法世界",
//     content: "在深夜的寂静中，一座威严的城堡顶层，被岁月雕琢的古老火炉重新吐出了温暖的火光。火焰的噼啪声唤醒了一位睡眼惺忪的老女人。她穿着绿色的长袍，从梦乡中惊醒，缓缓地从横卧转为坐立，继而稳稳站起身来。"
//   };
//
//   // 调用封装的服务
//   await ai_chapter_summary(requestBody, (data) => {
//     messages.value.push(data);
//     console.log(messages.value);
//   });
// });






// 清理和标准化字符串的函数
const cleanAndNormalizeString = (str) => {
  return str
      .trim() // 去除两端空格
      .replace(/\s+/g, ' ') // 替换多余的空格为单个空格
      .replace(/[\u200B-\u200F\uFEFF]/g, '') // 移除不可见字符
      .normalize('NFC'); // 标准化字符编码
};

const IsChanged = computed(() => {

  return cleanAndNormalizeString(content.value) !== cleanAndNormalizeString(oldContent.value) ||
      cleanAndNormalizeString(title.value) !== cleanAndNormalizeString(oldTitle.value) ||
      cleanAndNormalizeString(summary.value) !== cleanAndNormalizeString(oldSummary.value);
});

// 监听编辑器内容变化
const handleContentChange = (event: Event) => {
  const target = event.target as HTMLElement;

  content.value = target.innerHTML;
  //console.log(target.innerHTML);

  // console.log(target.textContent);

  // 将所有<div>替换为 "\n",将所有</div> 替换为 ""
  content.value = TransformText(target.innerHTML);
  // if (content.value === "") {
  //   content.value = "<div></div>";
  //   contentEditable.value.innerHTML = content.value;
  // }
  //console.log(content.value);
};

const selectChapter = (id: string) => {
  selected.value.id = id;
  selected.value.type = "chapter";
  LoadChapter();
};

const selectCharacter = (id: string) => {
  selected.value.id = id;
  selected.value.type = "character";
  LoadCharacter();
};

// 选中文本功能
const selectedText = ref("");
const selectedRange = ref(null);

const copyText = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const text = range.toString();

    // 保存当前选区为有效的 Range 对象
    const savedRange = selectedRange.value; // 克隆当前选区

    navigator.clipboard.writeText(text).then(() => {
      // 恢复选区
      const newSelection = window.getSelection();
      if (newSelection) {
        selection.removeAllRanges(); // 清空当前选区
        window.getSelection().addRange(savedRange); // 添加克隆的选区
      }
    });
  }
};

const wordCount = computed(() => {
  return content.value.replace(/\n/g, "").length;
});


// 处理文本选择
const handleTextSelection = () => {
  // 等待0.1秒后更新选中文本
  setTimeout(() => {
    const selection = window.getSelection();
    selectedText.value = selection.toString();
    if (selection.rangeCount > 0) {
      selectedRange.value = selection.getRangeAt(0).cloneRange(); // 克隆当前选区
    }
    //console.log("selected text 变更为",selectedText.value);
    //console.log("selected range 变更为",selectedRange.value);
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      // 计算工具栏的位置
      const editorRect = editorContainer.value.getBoundingClientRect();
      const top = rect.top - 35;
      const left = rect.right;
      toolbarPosition.value = {
        top: top,
        left: left,
      };
      showToolbar.value = true;
    } else {
      showToolbar.value = false;
    }
  }, 100);
};

// 处理粘贴事件
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault(); // 阻止默认粘贴行为
  const text = event.clipboardData?.getData('text/plain') ?? ''; // 获取纯文本内容
  document.execCommand('insertText', false, text); // 插入纯文本
};


// html 和 文字 互相转换
const TransformText = (text: string) => {
  return text.replace(/<div>/g, "\n")
      .replace(/<\/div>/g, "")
      .replace(/<br>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/<[^>]*>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/\r\n/g, "\n")
      .replace(/^\n+/, "")
      .replace(/\n+/g, "\n")
      .replace(/[\u200B]/g, "");
}

const TransformHtml = (html: string) => {
  const temp = html.replace(/\n/g, "</div><div>")
      .replace(/ /g, "&nbsp;"); // 将空格转换为&nbsp;


  return "<div>"+temp+"</div>";
}
</script>

<style scoped>
.save-icon {
  font-size: 8px;
}

.prose {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #374151;
  min-height: 300px;
  outline: none; /* 移除聚焦时的默认轮廓 */
}

.prose:focus {
  outline: none;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>