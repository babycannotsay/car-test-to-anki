import { Media } from 'anki-apkg-generator'
import fs from 'fs'
import fetch from 'cross-fetch'
import path from 'path'
import { BaseThirdParser } from 'parse-to-anki'
import { getQuestionById, getQuestionIdList } from './api'
import { ContentTypes, getCardType, getChapter, getKnowType, getStepType, Question, QuestionTypes } from './types'

const getExtensionFromUrl = (url: string) => {
    const extension = url
        .split(/[#?]/)[0]
        .split('.')
        .pop()!
        .trim()

    return `.${extension}`
}

export default class CarStudyParser extends BaseThirdParser {
    public name = '浙里学车::科目一'
    public list: number[] = []
    public mediaList: Media[] = []

    private addMedia (media: Media) {
        this.mediaList.push(media)
    }
    getMediaList () {
        return this.mediaList
    }

    private async addImageMedia (url: string) {
        const fileExt = getExtensionFromUrl(url)
        const data = await fetch(url).then(resp => resp.arrayBuffer())
        const media = new Media(data)
        const name = `${media.checksum}${fileExt}`
        media.setFilename(name)
        this.addMedia(media)
        return name
    }

    addSourceMedia () {
        const cssName = 'car-test.css'
        const css = fs.readFileSync(path.resolve(__dirname, `./${cssName}`))
        this.addMedia(new Media(css, `_${cssName}`))
        return `
            <link rel="stylesheet", href="_${cssName}"></link>
            <script>
                if (void 0===window.Persistence) { var _persistenceKey='github.com/SimonLammer/anki-persistence/',_defaultKey='_default';if (window.Persistence_sessionStorage=function () { var e=!1;try { 'object'==typeof window.sessionStorage&&(e=!0,this.clear=function () { for (var e=0;e<sessionStorage.length;e++) { var t=sessionStorage.key(e);0==t.indexOf(_persistenceKey)&&(sessionStorage.removeItem(t),e--) } },this.setItem=function (e,t) { null==t&&(t=e,e=_defaultKey),sessionStorage.setItem(_persistenceKey+e,JSON.stringify(t)) },this.getItem=function (e) { return null==e&&(e=_defaultKey),JSON.parse(sessionStorage.getItem(_persistenceKey+e)) },this.removeItem=function (e) { null==e&&(e=_defaultKey),sessionStorage.removeItem(_persistenceKey+e) }) } catch (e) {} this.isAvailable=function () { return e } },window.Persistence_windowKey=function (e) { var t=window[e],n=!1;'object'==typeof t&&(n=!0,this.clear=function () { t[_persistenceKey]={} },this.setItem=function (e,n) { null==n&&(n=e,e=_defaultKey),t[_persistenceKey][e]=n },this.getItem=function (e) { return null==e&&(e=_defaultKey),null==t[_persistenceKey][e]?null:t[_persistenceKey][e] },this.removeItem=function (e) { null==e&&(e=_defaultKey),delete t[_persistenceKey][e] },null==t[_persistenceKey]&&this.clear()),this.isAvailable=function () { return n } },window.Persistence=new Persistence_sessionStorage,Persistence.isAvailable()||(window.Persistence=new Persistence_windowKey('py')),!Persistence.isAvailable()) { var titleStartIndex=window.location.toString().indexOf('title'),titleContentIndex=window.location.toString().indexOf('main',titleStartIndex);titleStartIndex>0&&titleContentIndex>0&&titleContentIndex-titleStartIndex<10&&(window.Persistence=new Persistence_windowKey('qt')) } }
            </script>
        `
    }

    private async getList () {
        return getQuestionIdList().then(list => this.list = list)
    }
    async getNotes () {
        const list = await this.getList()
        const notes: { tags: string[], ankiFront: string, ankiBack: string, title: string }[] = []
        for (const id of list.slice(0, 1)) {
            const question = await getQuestionById(String(id))
            const tags = this.getTags(question)
            let imageName = null
            if (question.contentType === ContentTypes.WithPictures) {
                imageName = await this.addImageMedia(question.icon!)
            }
            const ankiFront = this.generateAnkiFront(question, imageName)
            const ankiBack = this.generateAnkiBack(question)
            notes.push({ tags, ankiFront, ankiBack, title: String(id) })
        }
        return notes
    }
    private getTags (question: Question) {
        const knowType = getKnowType(question.knowType)
        const chapter = getChapter(question.chapter)
        const stepType = getStepType(question.stepType)
        const cardType = getCardType(question.carType)
        return [ knowType, chapter, stepType, cardType ]
    }

    private generateAnkiFront (question: Question, imageName: string | null) {
        const index = this.list.indexOf(question.id)
        const options: string[] = []
        if (question.types === QuestionTypes.Questionnaire) {
            options.push(question.optiona, question.optionb)
        } else if (question.types === QuestionTypes.Option) {
            options.push(
                `A、${question.optiona}`,
                `B、${question.optionb}`,
                `C、${question.optionc}`,
                `D、${question.optiond}`,
            )
        }
        return `
            <div class="front">
                ${imageName ? `<img src="${imageName}" alt="img">` : ''}
                <div class="bottom">
                    <div class="header">
                        ${question.title}
                        <span class="index">(${index + 1}/${this.list.length})</span>
                    </div>
                    <div class="options">
                        ${options.map((option, index) => `
                            <input type="radio" name="option" value="${index+1}" class="option" id="option${index}">
                            <label for="option${index}">${option}</label><br />
                        `).join('')}
                    </div>
                </div>
            </div>
            <script>
                if (Persistence.isAvailable()) {
                    Array.prototype.slice.call(document.querySelectorAll('.option')).forEach(function (selector) {
                        selector.addEventListener('change', function () {
                            Persistence.setItem(this.value)
                        })
                    })
                }
            </script>
        `
    }

    private getAnswer (question: Question) {
        const answerMap: any = {
            A: `A、${question.optiona}`,
            B: `B、${question.optionb}`,
            C: `C、${question.optionc}`,
            D: `D、${question.optiond}`,
            true: question.optiona,
            false: question.optionb,
        }
        const answer = answerMap[question.answer]
        const currentValueMap: any = {
            A: '1',
            B: '2',
            C: '3',
            D: '4',
            true: '1',
            false: '2',
        }
        const currentValue = currentValueMap[question.answer]
        return [ answer, currentValue ]
    }

    private generateAnkiBack (question: Question) {
        const [ answer, currentValue ] = this.getAnswer(question)
        return `
            <div class="back">
                <div class="bar">${answer}</div>
                <div class="resolving">${question.resolving}</div>
            </div>
            <script>
                if (Persistence.isAvailable()) {
                    const value = Persistence.getItem()
                    Persistence.clear()
                    Array.prototype.slice.call(document.querySelectorAll('.option')).forEach(function (selector) {
                        if (selector.value === value) {
                            selector.checked = true
                        }
                    })
                    if ("${currentValue}" === value) {
                        document.querySelector('.bar').classList.add('correct')
                    } else {
                        document.querySelector('.bar').classList.add('error')
                    }
                }
            </script>
        `
    }
}
