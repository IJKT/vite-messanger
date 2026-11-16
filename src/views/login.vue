<script setup lang="ts">
import { ref, computed } from "vue";

const email = ref("");
const password = ref("");

const isFormValid = computed(() => {
  return email.value.trim().length > 0 && password.value.trim().length > 0;
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
    <!-- Application Logo -->
    <div class="flex items-center gap-2 text-2xl font-bold">
      <img src="../images/Message Icon.png" class="logo w-18" alt="Logo" />
      messenger app
    </div>
    <!-- Login Form -->
    <div
      class="flex flex-col gap-4 p-4 sm:p-6 rounded-2xl w-full max-w-xs sm:w-80 border"
    >
      <div class="flex flex-col gap-1">
        <label for="email">email</label>
        <input
          v-model="email"
          type="text"
          name="email"
          id="email"
          class="border p-2 rounded w-full"
          placeholder="Please enter your email"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="password">password</label>
        <input
          v-model="password"
          type="password"
          name="password"
          id="password"
          class="border p-2 rounded w-full"
          placeholder="Please enter your password"
        />
      </div>
      <button
        :disabled="!isFormValid"
        class="bg-brand-blue text-white font-bold p-2 rounded w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-blue cursor-pointer hover:bg-brand-blue-hover"
      >
        login
      </button>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
