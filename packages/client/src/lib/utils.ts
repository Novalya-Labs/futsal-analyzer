import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Format a date for display in the UI
 * If date is today, return time in format HH:MM
 * If date is within the current week, return the day name
 * Otherwise return the date in format MM/DD
 */
export function formatDate(date: Date): string {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

	// If the date is today, return time
	if (dateDay.getTime() === today.getTime()) {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	}

	// If the date is in the current week
	const dayDiff = Math.floor((today.getTime() - dateDay.getTime()) / (1000 * 60 * 60 * 24));
	if (dayDiff < 7 && dayDiff > 0) {
		return date.toLocaleDateString([], { weekday: "short" });
	}

	// Otherwise return month/day
	return date.toLocaleDateString([], { month: "numeric", day: "numeric" });
}
