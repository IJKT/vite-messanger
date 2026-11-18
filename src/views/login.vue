<template>
  <div
    class="min-h-screen bg-brand-bg-light flex flex-col items-center justify-center p-4 sm:p-6 text-brand-text-dark"
  >
    <div class="w-full max-w-sm flex flex-col items-center gap-6">
      <!-- Application Header / Logo -->
      <div class="flex flex-col items-center text-center gap-2">
        <div
          class="w-16 h-16 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center p-2.5"
        >
          <img
            src="../images/Message Icon.png"
            class="w-full h-full object-contain"
            alt="Application Logo"
          />
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-brand-text-dark">
          Messenger App
        </h1>
      </div>

      <!-- Login Card Form -->
      <div
        class="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7"
      >
        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <!-- Email Input Field -->
          <div class="flex flex-col gap-1.5">
            <label
              for="email"
              class="text-xs font-semibold text-brand-text-dark tracking-wider"
            >
              EMAIL
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              name="email"
              class="w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm text-brand-text-dark placeholder:text-brand-text-muted/60 transition-colors focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              :class="
                email && !isEmailValid ? 'border-rose-400' : 'border-slate-300'
              "
              placeholder="name@domain.com"
              required
            />
            <p v-if="email && !isEmailValid" class="text-xs text-rose-500">
              Please enter a valid email address.
            </p>
          </div>

          <!-- Password Input Field -->
          <div class="flex flex-col gap-1.5">
            <label
              for="password"
              class="text-xs font-semibold text-brand-text-dark tracking-wider"
            >
              PASSWORD
            </label>
            <div class="relative flex items-center">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                autocomplete="current-password"
                class="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border rounded-lg text-sm text-brand-text-dark placeholder:text-brand-text-muted/60 transition-colors focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                :class="
                  password && !isPasswordValid
                    ? 'border-rose-400'
                    : 'border-slate-300'
                "
                placeholder="Minimum 8 characters"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 text-brand-text-muted hover:text-brand-text-dark focus:outline-none cursor-pointer"
                :title="showPassword ? 'Hide password' : 'Show password'"
              >
                <!-- Eye / Eye-off icon -->
                <svg
                  v-if="!showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                </svg>
              </button>
            </div>
            <p
              v-if="password && !isPasswordValid"
              class="text-xs text-rose-500"
            >
              Password must be at least 8 characters.
            </p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="!isFormValid"
            class="mt-2 w-full bg-brand-blue text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-all hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const showPassword = ref(false);

// Email validation check -> using standard format (user@domain.ext)
const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value.trim());
});

// Password validation: minimum 8 characters
const isPasswordValid = computed(() => {
  return password.value.length >= 8;
});

// Enable sign in button only when both fields are valid
const isFormValid = computed(() => {
  return isEmailValid.value && isPasswordValid.value;
});

function handleLogin() {
  if (isFormValid.value) {
    router.push({ name: "ChatList" });
  }
}
</script>

<style scoped></style>
