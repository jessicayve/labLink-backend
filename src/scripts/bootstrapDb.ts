import fs from "fs"
import path from "path"

const dbPath = process.env.DB_FILE_PATH
const seedPath = path.resolve("lablink.db")

if (!dbPath) {
  console.error("DB_FILE_PATH não definido.")
  process.exit(1)
}

const dbDir = path.dirname(dbPath)

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

if (!fs.existsSync(dbPath)) {
  if (fs.existsSync(seedPath)) {
    fs.copyFileSync(seedPath, dbPath)
    console.log(`Banco copiado para ${dbPath}`)
  } else {
    console.log("Arquivo lablink.db não encontrado no projeto. Nenhum banco inicial foi copiado.")
  }
} else {
  console.log(`Banco já existe em ${dbPath}`)
}