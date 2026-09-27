/** Notification Windows (CordLauncher peut être réduit dans la zone de notification). */
export async function notifyDesktop(title: string, body: string) {
  try {
    const { isPermissionGranted, requestPermission, sendNotification } = await import("@tauri-apps/plugin-notification");
    if (!(await isPermissionGranted()) && (await requestPermission()) !== "granted") return;
    sendNotification({ title, body });
  } catch { /* notifications indisponibles */ }
}
