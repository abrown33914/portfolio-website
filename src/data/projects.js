// Simple list of project metadata used by the Projects component
// Each entry is intentionally small and descriptive so the UI can render
// a compact card for each project.
export const projects = [
  {
    // posture detection research project (Python + MediaPipe)
    title: "iMPOSTURE",
    tagline: "Python • MediaPipe • Google ADK",
    desc: "AI for posture and distraction detection with real-time alerts and wellness tracking.",
    repo: "https://github.com/abrown33914/iMPOSTURE",
  cover: import.meta.env.BASE_URL + "Projects/iMPOSTURE/ImpostureThumbnail.jpg",
  },
  {
    // mobile app with mapping and AI features
    title: "Neo Eden",
    tagline: "React Native • Google Maps • Gemini",
    desc: "Off-grid survival assistant with photo scanning, resource maps, and reporting.",
    repo: "https://github.com/abrown33914/neo-eden",
  cover: import.meta.env.BASE_URL + "Projects/NeoEden/1.jpg",
  },
  {
    // drone simulation and defense experiments
    title: "Securing Delivery Drones",
    tagline: "Gazebo • ArduPilot SITL • Python",
    desc: "RF jamming simulations with scripted defenses and fail-safe behaviors.",
    repo: "https://github.com/abrown33914/drone-project-simulations",
  cover: import.meta.env.BASE_URL + "Projects/Drones/DroneThumbnail.jpg",
  },
  {
    // server / DNS configuration project
    title: "Linux DNS Webserver Config",
    tagline: "Bash • BIND • Apache",
    desc: "Deployed a secure web server with custom domain and DNS zones.",
    repo: "https://github.com/abrown33914/linux-dns-webserver-config",
  cover: import.meta.env.BASE_URL + "Projects/DNS/DNSThumbnail.jpg",
  },
];
