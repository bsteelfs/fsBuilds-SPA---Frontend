import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import fs from "fs"
import path from "path"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // set the port to 5173
    host: "0.0.0.0", // listen on all network interfaces
  },
})

//   server: {
//     https: {
//       key: fs.readFileSync(
//         path.resolve("/Users/bsteel/Desktop/spacert/fsportal.test.key")
//       ),
//       cert: fs.readFileSync(
//         path.resolve("/Users/bsteel/Desktop/spacert/fsportal.test.crt")
//       ),
//     },
//     host: "fsportal.test",
//     port: 5173,
//   },
// })
