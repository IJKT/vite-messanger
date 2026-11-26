import { ref, computed } from "vue";

// Updates the logged in user with the email used during login
export function setLoggedInUser(email?: string) {
  loggedInEmail.value = email?.trim() || "";
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
export const loggedInEmail = ref<string>("");

// Reactive authentication state
export const isAuthenticated = computed(
  () => loggedInEmail.value.trim().length > 0,
);

// Reactive store of the logged-in user's username
export const loggedInUser = computed(() =>
  formatUserNameFromEmail(loggedInEmail.value),
);

/**
 * Fallback error
 * Generates up to 2 uppercase initials from a contact name for avatar fallbacks
 */
export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return trimmed[0].toUpperCase();
}
