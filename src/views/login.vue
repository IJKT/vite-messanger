<script setup lang="ts"></script>

<template>
  <div class="flex flex-col items-center justify-center h-screen gap-4">
    <!-- Application Logo -->
    <div class="flex items-center gap-2 text-2xl font-bold">
      <img src="../images/Message Icon.png" class="logo w-18" alt="Logo" />
      messenger app
    </div>
    <!-- Login Form -->
    <div class="flex flex-col gap-2 border border-black p-4">
      <div>email:</div>
      <input
        type="text"
        name="email"
        id="email"
        class="border-2 border-black"
        placeholder="Please enter your email"
      />
      <div>password:</div>
      <input
        type="password"
        name="password"
        id="password"
        class="border-2 border-black"
        placeholder="Please enter your password"
      />
      <button class="bg-blue-500 text-white font-bold p-2 rounded">
        login
      </button>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
