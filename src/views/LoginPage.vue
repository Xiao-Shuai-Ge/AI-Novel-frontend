<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div
      class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4"
  >
    <div class="w-full max-w-md bg-white rounded-t-2xl shadow-xl overflow-hidden">
      <!-- 切换标签 -->
      <div class="flex border-b border-gray-200">
        <button
            @click="activeTab = 'login'"
            :class="{
'text-blue-600 border-b-2 border-blue-600': activeTab === 'login',
'text-gray-500 hover:text-gray-700': activeTab !== 'login'
}"
            class="flex-1 py-4 px-6 text-center font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          登录
        </button>
        <button
            @click="activeTab = 'register'"
            :class="{
'text-blue-600 border-b-2 border-blue-600': activeTab === 'register',
'text-gray-500 hover:text-gray-700': activeTab !== 'register'
}"
            class="flex-1 py-4 px-6 text-center font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          注册
        </button>
      </div>
      <!-- 登录表单 -->
      <div v-if="activeTab === 'login'" class="p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-8 text-center">登录</h2>
        <form @submit.prevent="handleLogin">
          <!-- 邮箱输入框 -->
          <div class="mb-6">
            <div class="relative">
              <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i class="fas fa-envelope text-gray-400"></i>
              </div>
              <input
                  v-model="loginForm.email"
                  @blur="validateEmail('login')"
                  type="email"
                  placeholder="请输入邮箱地址"
                  :class="{
'border-red-500 focus:border-red-500': loginErrors.email,
'border-gray-300 focus:border-blue-500': !loginErrors.email
}"
                  class="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
              />
            </div>
            <p v-if="loginErrors.email" class="mt-2 text-sm text-red-600">
              {{ loginErrors.email }}
            </p>
          </div>
          <!-- 密码输入框 -->
          <div class="mb-6">
            <div class="relative">
              <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i class="fas fa-lock text-gray-400"></i>
              </div>
              <input
                  v-model="loginForm.password"
                  @blur="validatePassword('login')"
                  :type="showLoginPassword ? 'text' : 'password'"
                  placeholder="请输入密码"
                  :class="{
'border-red-500 focus:border-red-500': loginErrors.password,
'border-gray-300 focus:border-blue-500': !loginErrors.password
}"
                  class="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
              />
              <button
                  type="button"
                  @click="showLoginPassword = !showLoginPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer !rounded-button whitespace-nowrap"
              >
                <i
                    :class="showLoginPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                    class="text-gray-400 hover:text-gray-600"
                ></i>
              </button>
            </div>
            <p v-if="loginErrors.password" class="mt-2 text-sm text-red-600">
              {{ loginErrors.password }}
            </p>
          </div>
          <!-- 登录按钮 -->
          <button
              type="submit"
              :disabled="!isLoginFormValid"
              :class="{
'bg-blue-600 hover:bg-blue-700': isLoginFormValid,
'bg-gray-300 cursor-not-allowed': !isLoginFormValid
}"
              class="w-full py-3 px-4 text-white font-medium rounded-lg transition-colors cursor-pointer !rounded-button whitespace-nowrap"
          >
            登录
          </button>
        </form>
      </div>
      <!-- 注册表单 -->
      <div v-if="activeTab === 'register'" class="p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-8 text-center">注册</h2>
        <form @submit.prevent="handleRegister">
          <!-- 邮箱输入框 -->
          <div class="mb-6">
            <div class="relative">
              <div class="flex-1 relative">
                <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                    v-model="registerForm.email"
                    @blur="validateEmail('register')"
                    type="email"
                    placeholder="请输入邮箱地址"
                    :class="{
'border-red-500 focus:border-red-500': registerErrors.email,
'border-gray-300 focus:border-blue-500': !registerErrors.email
}"
                    class="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                />
              </div>
            </div>
            <p v-if="registerErrors.email" class="mt-2 text-sm text-red-600">
              {{ registerErrors.email }}
            </p>
          </div>
          <!-- 验证码输入框 -->
          <div class="mb-6">
            <div class="flex gap-2 relative">
              <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i class="fas fa-shield-alt text-gray-400"></i>
              </div>
              <input
                  v-model="registerForm.verificationCode"
                  @input="handleVerificationCodeInput"
                  @blur="validateVerificationCode"
                  type="text"
                  placeholder="请输入验证码"
                  maxlength="6"
                  :class="{
'border-red-500 focus:border-red-500': registerErrors.verificationCode,
'border-gray-300 focus:border-blue-500': !registerErrors.verificationCode
}"
                  class="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
              />
              <button
                  type="button"
                  @click="sendVerificationCode"
                  :disabled="!registerForm.email || registerErrors.email || countdown > 0"
                  :class="{
'bg-blue-600 hover:bg-blue-700 text-white': registerForm.email && !registerErrors.email && countdown === 0,
'bg-gray-300 text-gray-500 cursor-not-allowed': !registerForm.email || registerErrors.email || countdown > 0
}"
                  class="px-4 py-3 font-medium rounded-lg transition-colors cursor-pointer !rounded-button whitespace-nowrap"
              >
                {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
              </button>
            </div>
            <p
                v-if="registerErrors.verificationCode"
                class="mt-2 text-sm text-red-600"
            >
              {{ registerErrors.verificationCode }}
            </p>
          </div>
          <!-- 密码输入框 -->
          <div class="mb-6">
            <div class="relative">
              <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i class="fas fa-lock text-gray-400"></i>
              </div>
              <input
                  v-model="registerForm.password"
                  @blur="validatePassword('register')"
                  :type="showRegisterPassword ? 'text' : 'password'"
                  placeholder="请输入密码"
                  :class="{
'border-red-500 focus:border-red-500': registerErrors.password,
'border-gray-300 focus:border-blue-500': !registerErrors.password
}"
                  class="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
              />
              <button
                  type="button"
                  @click="showRegisterPassword = !showRegisterPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer !rounded-button whitespace-nowrap"
              >
                <i
                    :class="showRegisterPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                    class="text-gray-400 hover:text-gray-600"
                ></i>
              </button>
            </div>
            <p v-if="registerErrors.password" class="mt-2 text-sm text-red-600">
              {{ registerErrors.password }}
            </p>
          </div>
          <!-- 确认密码输入框 -->
          <div class="mb-6">
            <div class="relative">
              <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i class="fas fa-lock text-gray-400"></i>
              </div>
              <input
                  v-model="registerForm.confirmPassword"
                  @blur="validateConfirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="请确认密码"
                  :class="{
'border-red-500 focus:border-red-500': registerErrors.confirmPassword,
'border-gray-300 focus:border-blue-500': !registerErrors.confirmPassword
}"
                  class="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
              />
              <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer !rounded-button whitespace-nowrap"
              >
                <i
                    :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                    class="text-gray-400 hover:text-gray-600"
                ></i>
              </button>
            </div>
            <p
                v-if="registerErrors.confirmPassword"
                class="mt-2 text-sm text-red-600"
            >
              {{ registerErrors.confirmPassword }}
            </p>
          </div>
          <!-- 注册按钮 -->
          <button
              type="submit"
              :disabled="!isRegisterFormValid"
              :class="{
'bg-blue-600 hover:bg-blue-700': isRegisterFormValid,
'bg-gray-300 cursor-not-allowed': !isRegisterFormValid
}"
              class="w-full py-3 px-4 text-white font-medium rounded-lg transition-colors cursor-pointer !rounded-button whitespace-nowrap"
          >
            注册
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onUnmounted } from "vue";
import { ElMessage } from 'element-plus'
import {login, ping_jwt, register, send_captcha} from "../api/login";
import Header from "@/components/Header.vue";


// 导入用户状态管理器
import { useUserStore } from "../store/user"
const UserStore = useUserStore();

// 登录
const handleLogin = async () => {
  let data;
  try {
    data = await login({
      email: loginForm.value.email,
      password: loginForm.value.password,
      is_remember: true,
    });
    console.log(data);
    // 处理登录成功的逻辑
  } catch (error) {
    ElMessage({
      showClose: true,
      message: error.response.data,
      type: 'error',
    })
    console.log("错误:", error.response.data);
    // 在这里可以根据错误类型进行进一步处理
    if (error.response && error.response.status === 400 && error.response.data.message === "Password error") {
      console.log("密码错误！");
      // 可以展示错误提示给用户
    } else {
      console.error("登录失败:", error.response);
    }
  }
  UserStore.setAtoken(data.data.atoken)
  UserStore.setRtoken(data.data.rtoken)
  ElMessage({
    showClose: true,
    message: "登录成功！",
    type:'success',
  })
  console.log("登录成功！")
  // 3秒后跳转到首页
  setTimeout(() => {
    window.location.href = "/";
  }, 3000);
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!registerForm.value.email || registerErrors.value.email) {
    return;
  }

  //发送验证码
  try {
    const data = await send_captcha({
      email: registerForm.value.email
    });
    console.log(data);
  } catch (error) {
    ElMessage({
      showClose: true,
      message: error.response.data,
      type: 'error',
    })
  }

  // 开始倒计时
  countdown.value = 60;
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }
    }
  }, 1000);
};

// 处理注册
const handleRegister = async () => {
  validateEmail("register");
  validateVerificationCode();
  validatePassword("register");
  validateConfirmPassword();
  let data;
  try {
    // 发送注册请求
    data = await register({
      password: registerForm.value.password,
      email: registerForm.value.email,
      captcha: registerForm.value.verificationCode,
    });
    console.log(data);
  } catch (error) {
    ElMessage({
      showClose: true,
      message: error.response.data,
      type: 'error',
    })
  }
  UserStore.setAtoken(data.data.atoken)
  ElMessage({
    showClose: true,
    message: "注册成功！",
    type:'success',
  })
  console.log("注册成功！")
  // 3秒后跳转到首页
  setTimeout(() => {
    window.location.href = "/";
  }, 3000);
};



// 每10秒 ping 一次 测试 token 是否失效
// setInterval(async () => {
//   const data = await ping_jwt();
//   console.log("atoken:", UserStore.getAtoken())
//   console.log("rtoken:", UserStore.getRtoken())
//   // if (UserStore.getAtoken() == UserStore.getRtoken()) {
//   //   console.log("这他妈是同一个 token")
//   // }
//   console.log(data);
// }, 5000)

// 当前激活的标签
const activeTab = ref<"login" | "register">("login");
// 密码显示状态
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);
const showConfirmPassword = ref(false);
// 验证码倒计时
const countdown = ref(0);
let countdownTimer: NodeJS.Timeout | null = null;
// 登录表单数据
const loginForm = ref({
  email: "",
  password: "",
});
// 注册表单数据
const registerForm = ref({
  email: "",
  verificationCode: "",
  password: "",
  confirmPassword: "",
});
// 登录表单错误
const loginErrors = ref({
  email: "",
  password: "",
});
// 注册表单错误
const registerErrors = ref({
  email: "",
  verificationCode: "",
  password: "",
  confirmPassword: "",
});
// 邮箱格式验证
const validateEmail = (formType: "login" | "register") => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const email =
      formType === "login" ? loginForm.value.email : registerForm.value.email;
  const errors =
      formType === "login" ? loginErrors.value : registerErrors.value;
  if (!email) {
    errors.email = "请输入邮箱地址";
  } else if (!emailRegex.test(email)) {
    errors.email = "请输入正确的邮箱格式";
  } else {
    errors.email = "";
  }
};
// 密码强度验证
const validatePassword = (formType: "login" | "register") => {
  const password =
      formType === "login"
          ? loginForm.value.password
          : registerForm.value.password;
  const errors =
      formType === "login" ? loginErrors.value : registerErrors.value;
  if (!password) {
    errors.password = "请输入密码";
  } else if (password.length < 6) {
    errors.password = "密码长度至少 6 位";
  } else {
    errors.password = "";
  }
};
// 验证码验证
const validateVerificationCode = () => {
  const code = registerForm.value.verificationCode;
  if (!code) {
    registerErrors.value.verificationCode = "请输入验证码";
  } else if (code.length !== 6) {
    registerErrors.value.verificationCode = "验证码必须为 6 位数字";
  } else if (!/^\d{6}$/.test(code)) {
    registerErrors.value.verificationCode = "验证码只能包含数字";
  } else {
    registerErrors.value.verificationCode = "";
  }
};
// 确认密码验证
const validateConfirmPassword = () => {
  const password = registerForm.value.password;
  const confirmPassword = registerForm.value.confirmPassword;
  if (!confirmPassword) {
    registerErrors.value.confirmPassword = "请确认密码";
  } else if (password !== confirmPassword) {
    registerErrors.value.confirmPassword = "两次输入的密码不一致";
  } else {
    registerErrors.value.confirmPassword = "";
  }
};
// 处理验证码输入（只允许数字）
const handleVerificationCodeInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value.replace(/\D/g, "");
  registerForm.value.verificationCode = value;
};
// 登录表单验证状态
const isLoginFormValid = computed(() => {
  return (
      loginForm.value.email &&
      loginForm.value.password &&
      !loginErrors.value.email &&
      !loginErrors.value.password
  );
});
// 注册表单验证状态
const isRegisterFormValid = computed(() => {
  return (
      registerForm.value.email &&
      registerForm.value.verificationCode &&
      registerForm.value.password &&
      registerForm.value.confirmPassword &&
      !registerErrors.value.email &&
      !registerErrors.value.verificationCode &&
      !registerErrors.value.password &&
      !registerErrors.value.confirmPassword
  );
});
// 清理定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style scoped>
.\!rounded-button {
  border-radius: 0.5rem;
}
/* 隐藏数字输入框的箭头 */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
