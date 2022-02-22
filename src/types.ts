/** 专项练习 */
export enum KnowTypes {
    /** 安全常识 */
    SafetyKnowledge = 1,
    /** 道路通行 */
    RoadPassage,
    /** 灯光仪表 */
    LightMeter,
    /** 交通手势 */
    TrafficSigns,
    /** 文明驾驶 */
    CivilizationDriving,
    /** 证照处罚 */
    LicensesPunishment,
    /** 标志信号灯 */
    MarkerLight,
    /** 速度 */
    Speed,
    /** 特殊天气 */
    SpecialWeather,
    /** 危机处置 */
    CrisisHandling,
}

export const getKnowType = (knowType: KnowTypes) => {
    const typeMap = {
        [KnowTypes.SafetyKnowledge]: '安全常识',
        [KnowTypes.RoadPassage]: '道路通行',
        [KnowTypes.LightMeter]: '灯光仪表',
        [KnowTypes.TrafficSigns]: '交通手势',
        [KnowTypes.CivilizationDriving]: '文明驾驶',
        [KnowTypes.LicensesPunishment]: '证照处罚',
        [KnowTypes.MarkerLight]: '标志信号灯',
        [KnowTypes.Speed]: '速度',
        [KnowTypes.SpecialWeather]: '特殊天气',
        [KnowTypes.CrisisHandling]: '危机处置',
    }
    return typeMap[knowType]
}

/** 章节 */
export enum Chapters {
    /** 道路交通安全法律、法规和规章 */
    Rule = 121,
    /** 交通信号 */
    TrafficSigns,
    /** 安全行车、文明驾驶基础知识 */
    DriveBasicKnowledge,
    /** 机动车驾驶操作相关基础知识 */
    OperateBasicKnowledge
}

export const getChapter = (chapter: Chapters) => {
    const chapterMap = {
        [Chapters.Rule]: '道路交通安全法律、法规和规章',
        [Chapters.TrafficSigns]: '交通信号',
        [Chapters.DriveBasicKnowledge]: '安全行车、文明驾驶基础知识',
        [Chapters.OperateBasicKnowledge]: '机动车驾驶操作相关基础知识',
    }
    return chapterMap[chapter]
}

/** 科目 */
export enum StepTypes {
    /** 科目一 */
    SubjectA = '1',
    /** 科目四 */
    SubjectD = '4'
}
export const getStepType = (stepType: StepTypes) => {
    const stepTypeMap = {
        [StepTypes.SubjectA]: '科目一',
        [StepTypes.SubjectD]: '科目四',
    }
    return stepTypeMap[stepType]
}
/** 题型 */
export enum QuestionTypes {
    /** 选择题 */
    Option = 1,
    /** 判断题 */
    Questionnaire = 3
}

/** 内容类型 */
export enum ContentTypes {
    PlainText = 1,
    WithPictures = 2,
    WithVideos = 3
}

/** 车型  */
export enum CarTypes {
    /** 小车 */
    Car = 'car',
    /** 客车 */
    Bus = 'bus',
    /** 货车 */
    Truck = 'truck'
}

export const getCardType = (carType: CarTypes) => {
    const carTypeMap = {
        car: '小车',
        bus: '客车',
        truck: '货车',
    }
    return carTypeMap[carType]
}
export interface Question {
    id: number,
    /** 专项练习 */
    knowType: KnowTypes
    /** 题目 */
    title: string
    /** 选项 */
    optiona: string
    optionb: string
    optionc: string | null
    optiond: string | null
    /** 详解 */
    resolving: string
    /** 答案 */
    answer: string
    /** 车型  */
    carType: CarTypes
    /** 交通信号图 */
    icon: string | null
    /** 章节 */
    chapter: Chapters
    /** 科目 */
    stepType: StepTypes
    /** 难度 */
    hardLevel: number
    /** 题型 */
    types: QuestionTypes
    /** 内容类型 */
    contentType: ContentTypes
}

