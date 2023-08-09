export interface LoginRequestData {
    email: string;
    api_key: string;
}

export interface LoginresponseData {
    token: string
}

export interface BaseResponse<T> {
    total: number;
    count: number;
    page: number;
    items: T[]
}


export interface CustomerResponseItems {
    id: number;
    branch_ids:number[];
    teacher_ids:number[];
    name: string;
    color: number | null;
    study_status_id:  number | null,
    lead_status_id:  number | null,
    lead_reject_id: number | null,
    lead_source_id:  number | null,
    assigned_id :  number | null,
    legal_type:  number | null,
    legal_name: string;
    company_id:  number | null,
    dob: string;
    balance: string;
    balance_bonus: number
    paid_count: number
    next_lesson_date: Date;
    paid_till: Date;
    last_attend_date: string;
    b_date: Date;
    e_date: string;
    note: string;
    paid_lesson_count:  number | null,
    paid_lesson_date: Date;
    phone: string[];
    email: string[];
    custom_esteshtedeti: string;
    custom_formaobucheniya: string;
    custom_rayonprozhivaniya: string;
    custom_soglasienaizo: string;
    custom_source: string;
    custom_vklyuchatvinfo: string;
    custom_zhdutgruppu: string;
}

export interface FromatCustomersData {
    id: number;
    note: string;
    create_date_time?: string;
}