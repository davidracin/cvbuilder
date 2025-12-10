import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { format, parse, parseISO, isValid } from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Date utility functions for ISO storage and display formatting

/**
 * Format ISO date string to display format (e.g., "Feb 2024")
 * @param {string} isoDate - ISO date string (e.g., "2024-02-01")
 * @param {string} formatStr - date-fns format string (default: "MMM yyyy")
 * @returns {string} Formatted date string
 */
export function formatDate(isoDate, formatStr = "MMM yyyy") {
  if (!isoDate) return "";
  try {
    const date = parseISO(isoDate);
    if (!isValid(date)) return isoDate;
    return format(date, formatStr);
  } catch {
    return isoDate;
  }
}

/**
 * Format ISO date string to full display format (e.g., "February 11, 2024")
 * @param {string} isoDate - ISO date string
 * @returns {string} Formatted date string
 */
export function formatDateFull(isoDate) {
  return formatDate(isoDate, "MMMM d, yyyy");
}

/**
 * Format ISO date string to short display format (e.g., "02/2024")
 * @param {string} isoDate - ISO date string
 * @returns {string} Formatted date string
 */
export function formatDateShort(isoDate) {
  return formatDate(isoDate, "MM/yyyy");
}

/**
 * Parse Date object to ISO string (YYYY-MM-DD format)
 * @param {Date} date - JavaScript Date object
 * @returns {string} ISO date string
 */
export function dateToISO(date) {
  if (!date || !(date instanceof Date) || !isValid(date)) return "";
  return format(date, "yyyy-MM-dd");
}

/**
 * Parse ISO string to Date object for date picker
 * @param {string} isoDate - ISO date string
 * @returns {Date|undefined} Date object or undefined
 */
export function isoToDate(isoDate) {
  if (!isoDate) return undefined;
  try {
    const date = parseISO(isoDate);
    return isValid(date) ? date : undefined;
  } catch {
    return undefined;
  }
}
