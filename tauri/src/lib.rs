// use tauri::{AppHandle, Manager};
use tauri::Manager;
use tauri_plugin_deep_link::DeepLinkExt;

// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

// #[tauri::command]
// fn get_initial_urls(app: tauri::AppHandle) -> Option<Vec<Url>> {
//   app.unmanage::<Vec<Url>>()
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();
    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            println!("A new app instance was opened with args: {args:?} and the deep link event was already triggered.");
            let _ = app.get_webview_window("main")
                       .expect("no main window")
                       .set_focus();
        }));
    }

    builder
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_deep_link::init())
        .setup(|app| {
            // Runtime registration for Deep Link - useful in Dev
            #[cfg(any(windows, target_os = "linux"))]
            {
                use tauri_plugin_deep_link::DeepLinkExt;
                app.deep_link().register_all()?;
            }
            #[cfg(mobile)] {
                app.handle().plugin(tauri_plugin_biometric::init())?;
            }
            // if let Ok(urls) = app.deep_link().get_current() {
            //     if let Some(urls) = urls {
            //         app.manage(urls);
            //     }
            // }
            #[cfg(desktop)] {
                let _ = app.handle().plugin(tauri_plugin_cli::init());
                let _ = app.handle().plugin(tauri_plugin_autostart::init(
                    tauri_plugin_autostart::MacosLauncher::LaunchAgent,
                    Some(vec!["--autostart"]),
                ));
            }
            app.deep_link().on_open_url(|event| {
                println!("deep link URLs: {:?}", event.urls());
            });
            Ok(())
        })
        // .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
