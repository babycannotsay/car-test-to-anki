import fs from 'fs'
import { Parser } from 'parse-to-anki'
import CarStudyParser from './car-study-parser'
async function execute () {
    const parser = new Parser(new CarStudyParser)
    const file: any = await parser.parseJSON()
    fs.writeFileSync('./test.apkg', file, 'binary')
}
execute()
