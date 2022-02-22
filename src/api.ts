/**source: http://www.jaxc.cn/#/home */
import fetch from 'cross-fetch'
import { CarTypes, StepTypes, Question } from './types'

const HOST = 'http://www.jaxc.cn/gzpt/index/theoryCenter'

export const getQuestionIdList = function (carType = CarTypes.Car, stepType = StepTypes.SubjectA): Promise<number[]> {
    const params = new URLSearchParams({
        carType,
        stepType,
        isOrder: 'true',
    }).toString()
    return fetch(`${HOST}/getQuestionIdList?${params}`)
        .then(res => res.json())
        .then(res => res.data)
}

export const getQuestionById = function (id: string): Promise<Question> {
    const params = new URLSearchParams({ id }).toString()
    return fetch(`${HOST}/getQuestionById?${params}`)
        .then(res => res.json())
        .then(res => res.data)
}
