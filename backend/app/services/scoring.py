"""Scoring service for MBTI."""

PERSONALITY_DATA = {
    "INTJ": {"name_cn": "建筑师", "name_en": "Architect", "description": "富有想象力和战略思维的思考者，他们对自己的想法充满信心，能够在复杂的系统中看到可能性。", "dimension_analysis": {"EI": "你倾向于内向(I)，通过独处和思考来恢复能量。", "SN": "你偏向直觉(N)，关注可能性和模式。", "TF": "你偏向思考(T)，依据逻辑做决定。", "JP": "你偏向判断(J)，喜欢有计划有秩序的生活。"}, "career_suggestions": ["战略顾问", "数据科学家", "软件架构师", "律师", "金融分析师"], "compatible_types": ["ENFP", "ENTP", "INFJ"], "incompatible_types": ["ESFJ", "ISFP"], "color": "#6366F1"},
    "INTP": {"name_cn": "逻辑学家", "name_en": "Logician", "description": "具有惊人创造力的发明家，他们对知识充满渴望，善于用逻辑和分析来理解世界。", "dimension_analysis": {"EI": "你倾向于内向(I)，享受独立思考的时间。", "SN": "你偏向直觉(N)，关注抽象概念和理论框架。", "TF": "你偏向思考(T)，追求逻辑一致性。", "JP": "你偏向知觉(P)，喜欢保持开放性。"}, "career_suggestions": ["哲学家", "大学教授", "软件工程师", "系统分析师", "经济学家"], "compatible_types": ["ENFJ", "ENTJ", "INFP"], "incompatible_types": ["ESFJ", "ESTJ"], "color": "#8B5CF6"},
    "ENTJ": {"name_cn": "指挥官", "name_en": "Commander", "description": "大胆、富有想象力、意志坚定的领导者，总是能够找到解决方案。", "dimension_analysis": {"EI": "你倾向于外向(E)，从与他人互动中获得能量。", "SN": "你偏向直觉(N)，关注未来可能性。", "TF": "你偏向思考(T)，决策基于逻辑和效率。", "JP": "你偏向判断(J)，喜欢控制和计划。"}, "career_suggestions": ["CEO", "律师", "管理咨询师", "企业家", "投资银行家"], "compatible_types": ["INFP", "INTP", "ENFP"], "incompatible_types": ["ISFP", "ISTP"], "color": "#EF4444"},
    "ENTP": {"name_cn": "辩论家", "name_en": "Debater", "description": "聪明好奇的思想者，他们喜欢挑战现状，用创意和机智激励他人。", "dimension_analysis": {"EI": "你倾向于外向(E)，享受头脑风暴和交流想法。", "SN": "你偏向直觉(N)，善于看到多种可能性。", "TF": "你偏向思考(T)，喜欢逻辑分析。", "JP": "你偏向知觉(P)，适应变化，喜欢同时处理多个项目。"}, "career_suggestions": ["律师", "公关专家", "创业者", "营销策略师", "记者"], "compatible_types": ["INTJ", "INFJ", "INTP"], "incompatible_types": ["ISFJ", "ISTJ"], "color": "#F59E0B"},
    "INFJ": {"name_cn": "提倡者", "name_en": "Advocate", "description": "安静而神秘的特殊个体，他们极具理想主义，追求有意义的人际联系。", "dimension_analysis": {"EI": "你倾向于内向(I)，偏好深度的人际关系。", "SN": "你偏向直觉(N)，关注深层含义和未来可能性。", "TF": "你偏向情感(F)，重视和谐与他人的感受。", "JP": "你偏向判断(J)，有明确的价值观和原则。"}, "career_suggestions": ["心理咨询师", "社会工作者", "作家", "人力资源经理", "非营利组织管理者"], "compatible_types": ["INFP", "ENFP", "INTJ"], "incompatible_types": ["ESTP", "ESFP"], "color": "#10B981"},
    "INFP": {"name_cn": "调停者", "name_en": "Mediator", "description": "诗意、善良、无私的梦想家，他们总是热于帮助他人，内心有着强烈的价值观。", "dimension_analysis": {"EI": "你倾向于内向(I)，从独处中获得能量。", "SN": "你偏向直觉(N)，关注可能性和象征意义。", "TF": "你偏向情感(F)，基于个人价值观做决定。", "JP": "你偏向知觉(P)，保持开放和灵活。"}, "career_suggestions": ["作家/诗人", "心理学家", "艺术家", "教师", "神职人员"], "compatible_types": ["ENFJ", "ENTJ", "INFJ"], "incompatible_types": ["ESTJ", "ISTP"], "color": "#06B6D4"},
    "ENFJ": {"name_cn": "主人公", "name_en": "Protagonist", "description": "富有魅力和鼓舞人心的领导者，他们能够吸引听众并引导他人走向更好的未来。", "dimension_analysis": {"EI": "你倾向于外向(E)，从与他人的互动中获得能量。", "SN": "你偏向直觉(N)，关注未来的可能性。", "TF": "你偏向情感(F)，重视他人的感受和需求。", "JP": "你偏向判断(J)，喜欢计划和组织。"}, "career_suggestions": ["培训师", "人力资源经理", "咨询师", "外交官", "作家"], "compatible_types": ["INFP", "INTP", "ISFP"], "incompatible_types": ["ISTP", "ESTP"], "color": "#EC4899"},
    "ENFP": {"name_cn": "竞选者", "name_en": "Campaigner", "description": "充满热情、创造力和社交能力的人，他们总是能看到周围人的潜力。", "dimension_analysis": {"EI": "你倾向于外向(E)，从社交活动中获得能量。", "SN": "你偏向直觉(N)，关注可能性和创意。", "TF": "你偏向情感(F)，基于个人热情做决定。", "JP": "你偏向知觉(P)，灵活适应变化。"}, "career_suggestions": ["演员", "记者", "市场营销", "广告创意", "摄影师"], "compatible_types": ["INTJ", "INFJ", "INFP"], "incompatible_types": ["ISTJ", "ESTJ"], "color": "#F97316"},
    "ISTJ": {"name_cn": "物流师", "name_en": "Logistician", "description": "实事求是、注重事实的人，他们有强烈的责任感，会坚持完成自己的承诺。", "dimension_analysis": {"EI": "你倾向于内向(I)，从独处中获得能量。", "SN": "你偏向感觉(S)，关注具体事实和细节。", "TF": "你偏向思考(T)，决策基于逻辑和规则。", "JP": "你偏向判断(J)，喜欢计划和秩序。"}, "career_suggestions": ["会计", "审计师", "律师", "警察", "军人"], "compatible_types": ["ESFP", "ISFP", "ESTJ"], "incompatible_types": ["ENFP", "ENTP"], "color": "#64748B"},
    "ISFJ": {"name_cn": "守卫者", "name_en": "Defender", "description": "非常专注和勤劳的人，他们工作勤奋、认真负责，总是乐于助人。", "dimension_analysis": {"EI": "你倾向于内向(I)，从独处中获得能量。", "SN": "你偏向感觉(S)，关注具体细节和现实情况。", "TF": "你偏向情感(F)，重视他人的感受。", "JP": "你偏向判断(J)，有责任心，喜欢按照计划行事。"}, "career_suggestions": ["护士", "医生", "社会工作者", "图书馆管理员", "HR"], "compatible_types": ["ESFP", "ESTP", "ENFJ"], "incompatible_types": ["INTJ", "ENTJ"], "color": "#84CC16"},
    "ESTJ": {"name_cn": "总经理", "name_en": "Executive", "description": "优秀的管理者，他们善于管理事务，组织和关注他人的需求。", "dimension_analysis": {"EI": "你倾向于外向(E)，从行动和与他人互动中获得能量。", "SN": "你偏向感觉(S)，关注具体的现实情况。", "TF": "你偏向思考(T)，注重逻辑和效率。", "JP": "你偏向判断(J)，喜欢控制和秩序。"}, "career_suggestions": ["企业高管", "律师", "法官", "军官", "教师"], "compatible_types": ["ISFP", "ISTP", "INTJ"], "incompatible_types": ["INFP", "ENFP"], "color": "#0EA5E9"},
    "ESFJ": {"name_cn": "执政官", "name_en": "Consul", "description": "非常关注他人需求的人，他们善于照顾他人，提供支持并确保和谐。", "dimension_analysis": {"EI": "你倾向于外向(E)，从社交活动中获得能量。", "SN": "你偏向感觉(S)，关注具体现实，尊重传统。", "TF": "你偏向情感(F)，重视他人的感受。", "JP": "你偏向判断(J)，喜欢计划和组织。"}, "career_suggestions": ["护士", "教师", "HR", "客户服务", "市场营销"], "compatible_types": ["ISFP", "ISTP", "INFP"], "incompatible_types": ["INTJ", "INTP"], "color": "#D946EF"},
    "ISTP": {"name_cn": "鉴赏家", "name_en": "Virtuoso", "description": "大胆而实际的实验者，他们是用任何工具创造奇迹的工匠。", "dimension_analysis": {"EI": "你倾向于内向(I)，从独立工作中获得能量。", "SN": "你偏向感觉(S)，关注具体细节和实际应用。", "TF": "你偏向思考(T)，逻辑清晰，善于分析问题。", "JP": "你偏向知觉(P)，适应变化灵活。"}, "career_suggestions": ["工程师", "机械师", "飞行员", "消防员", "程序员"], "compatible_types": ["ESFJ", "ESTJ", "ENFJ"], "incompatible_types": ["INFJ", "ENFJ"], "color": "#A855F7"},
    "ISFP": {"name_cn": "探险家", "name_en": "Adventurer", "description": "灵活有魅力的艺术家，他们总是愿意尝试和体验新事物。", "dimension_analysis": {"EI": "你倾向于内向(I)，从独处中获得能量。", "SN": "你偏向感觉(S)，关注当下的体验和具体的感官享受。", "TF": "你偏向情感(F)，重视个人价值观和审美体验。", "JP": "你偏向知觉(P)，保持开放和灵活。"}, "career_suggestions": ["艺术家", "设计师", "摄影师", "厨师", "音乐家"], "compatible_types": ["ESFJ", "ESTJ", "ENFP"], "incompatible_types": ["INTJ", "ENTJ"], "color": "#F43F5E"},
    "ESTP": {"name_cn": "企业家", "name_en": "Entrepreneur", "description": "聪明、精力充沛、善于感知的人，他们真正享受冒险带来的刺激。", "dimension_analysis": {"EI": "你倾向于外向(E)，从行动和与他人互动中获得能量。", "SN": "你偏向感觉(S)，关注眼前的现实和具体的细节。", "TF": "你偏向思考(T)，善于分析利弊，快速决策。", "JP": "你偏向知觉(P)，适应变化灵活。"}, "career_suggestions": ["企业家", "销售", "经纪人", "急诊医生", "消防员"], "compatible_types": ["ISFJ", "ISTJ", "INFJ"], "incompatible_types": ["INFP", "ENFJ"], "color": "#14B8A6"},
    "ESFP": {"name_cn": "表演者", "name_en": "Entertainer", "description": "自发、精力充沛、热心的表演者，他们喜欢成为众人瞩目的焦点。", "dimension_analysis": {"EI": "你倾向于外向(E)，从社交活动中获得能量。", "SN": "你偏向感觉(S)，关注当下的体验和具体的感官享受。", "TF": "你偏向情感(F)，重视他人的感受，善于表达情感。", "JP": "你偏向知觉(P)，灵活适应变化。"}, "career_suggestions": ["演员", "歌手", "主持人", "摄影师", "导游"], "compatible_types": ["ISFJ", "ISTJ", "INTJ"], "incompatible_types": ["INTJ", "INTP"], "color": "#EAB308"},
}

def calculate_mbti(answers, questions):
    dim_map = {q["id"]: q["dimension"] for q in questions}
    scores = {"EI": {"E": 0, "I": 0}, "SN": {"S": 0, "N": 0}, "TF": {"T": 0, "F": 0}, "JP": {"J": 0, "P": 0}}
    for a in answers:
        dim = dim_map.get(a["question_id"])
        if not dim:
            continue
        if dim == "EI":
            scores["EI"]["E" if a["chosen_option"] == "A" else "I"] += 1
        elif dim == "SN":
            scores["SN"]["S" if a["chosen_option"] == "A" else "N"] += 1
        elif dim == "TF":
            scores["TF"]["T" if a["chosen_option"] == "A" else "F"] += 1
        elif dim == "JP":
            scores["JP"]["J" if a["chosen_option"] == "A" else "P"] += 1
    result = ""
    result += "E" if scores["EI"]["E"] >= scores["EI"]["I"] else "I"
    result += "S" if scores["SN"]["S"] >= scores["SN"]["N"] else "N"
    result += "T" if scores["TF"]["T"] >= scores["TF"]["F"] else "F"
    result += "J" if scores["JP"]["J"] >= scores["JP"]["P"] else "P"
    return result, scores

def generate_result_data(mbti_type, scores):
    base = PERSONALITY_DATA.get(mbti_type, PERSONALITY_DATA["INTJ"])
    radar = [
        int((scores["EI"]["E" if mbti_type[0] == "E" else "I"]) / 15 * 100),
        int((scores["SN"]["S" if mbti_type[1] == "S" else "N"]) / 15 * 100),
        int((scores["TF"]["T" if mbti_type[2] == "T" else "F"]) / 15 * 100),
        int((scores["JP"]["J" if mbti_type[3] == "J" else "P"]) / 15 * 100),
    ]
    return {
        "type": mbti_type,
        "scores": {
            "EI": {"E": scores["EI"]["E"], "I": scores["EI"]["I"], "dominant": mbti_type[0]},
            "SN": {"S": scores["SN"]["S"], "N": scores["SN"]["N"], "dominant": mbti_type[1]},
            "TF": {"T": scores["TF"]["T"], "F": scores["TF"]["F"], "dominant": mbti_type[2]},
            "JP": {"J": scores["JP"]["J"], "P": scores["JP"]["P"], "dominant": mbti_type[3]},
        },
        "radar_data": radar,
        "name_cn": base["name_cn"],
        "name_en": base["name_en"],
        "description": base["description"],
        "dimension_analysis": base["dimension_analysis"],
        "career_suggestions": base["career_suggestions"],
        "compatible_types": base["compatible_types"],
        "incompatible_types": base["incompatible_types"],
        "color": base["color"],
    }
