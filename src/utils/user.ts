import { ref, computed } from "vue";

// Fallback email used ONLY when no user has logged in yet
export const DEFAULT_USER_EMAIL = "chris_evans@gmail.com";

/**
 * Pure formatter: converts an email address into a Title Case display username.
 * e.g. "chris_evans@gmail.com" -> "Chris Evans"
 */
export function formatUserNameFromEmail(email: string): string {
  if (!email || !email.includes("@")) return "";
  const namePart = email.trim().split("@")[0];
  return namePart
    .split(/[._-]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Reactive state holding the actual email entered by the user in login.vue.
 * Starts empty until setLoggedInUser() is called.
 */
export const loggedInEmail = ref<string>("");

/**
 * Stores the actual email from the login view.
 */
export function setLoggedInUser(email?: string) {
  loggedInEmail.value = email ? email.trim() : "";
}

/**
 * The actual username of the logged-in user.
 * Derived dynamically from the email captured via setLoggedInUser().
 * Uses DEFAULT_USER_EMAIL purely as a fallback if not logged in.
 */
export const loggedInUser = computed(() => {
  const activeEmail = loggedInEmail.value || DEFAULT_USER_EMAIL;
  return formatUserNameFromEmail(activeEmail);
});

// Alias for convenience
export const currentUserName = loggedInUser;

export default loggedInUser;
