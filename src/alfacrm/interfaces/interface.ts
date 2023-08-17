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
    study_status_id: number | null,
    lead_status_id: number | null,
    lead_reject_id: number | null,
    lead_source_id: number | null,
    assigned_id : number | null,
    legal_type: number | null,
    legal_name: string;
    company_id: number | null,
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
    paid_lesson_count: number | null,
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


export interface PayResponseItems {
    id: number;
    location_id: number | null,
    customer_id: number | null,
    employee_id: number | null,
    pay_item_category_id: number | null,
    pay_type_id: number | null,
    pay_item_id: number | null,
    pay_account_id: number | null,
    commodity_id: number | null,
    payer_name: string
    note: string;
    is_confirmed: number;
    group_ids: number[];
    is_fiscal: number;
    document_date: string
    income: string
  }