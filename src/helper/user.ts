import { ref, computed } from "vue";

// TODO: will be removed after implementing proper authentication and page guards
export const DEFAULT_USER_EMAIL = "chris_evans@gmail.com";

// Updates the logged in user with the email used during login
export function setLoggedInUser(email?: string) {
  loggedInEmail.value = email || DEFAULT_USER_EMAIL;
}

// Formats an email into a display username (Title Case)
export function formatUserNameFromEmail(email?: string): string {
  if (!email || !email.includes("@")) {
    return "";
  }

  const namePart = email.trim().split("@")[0];
  return namePart
    .split(/[._-]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Reactive store of the logged-in user's email
export const loggedInEmail = ref<string>(DEFAULT_USER_EMAIL);

// Reactive store of the logged-in user's username
export const loggedInUser = computed(() =>
  formatUserNameFromEmail(loggedInEmail.value),
);
