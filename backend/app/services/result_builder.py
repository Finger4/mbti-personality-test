"""Build full result response from raw scores."""
from app.models.result import UserTestResult

def build_full_result_response(result: UserTestResult) -> dict:
    """根据原始分数构建完整结果（包含付费内容）"""
    # 计算类型
    e_or_i = "E" if result.score_e >= result.score_i else "I"
    s_or_n = "S" if result.score_s >= result.score_n else "N"
    t_or_f = "T" if result.score_t >= result.score_f else "F"
    j_or_p = "J" if result.score_j >= result.score_p else "P"
    mbti_type = e_or_i + s_or_n + t_or_f + j_or_p
    
    # MBTI类型元数据
    TYPE_INFO = {
        "INTJ": {"name_cn": "建筑师", "name_en": "Architect", "color": "#1E3A8A"},
        "INTP": {"name_cn": "逻辑学家", "name_en": "Logician", "color": "#7C3AED"},
        "ENTJ": {"name_cn": "指挥官", "name_en": "Commander", "color": "#DC2626"},
        "ENTP": {"name_cn": "辩论家", "name_en": "Debater", "color": "#EA580C"},
        "INFJ": {"name_cn": "提倡者", "name_en": "Advocate", "color": "#7C3AED"},
        "INFP": {"name_cn": "调停者", "name_en": "Mediator", "color": "#DB2777"},
        "ENFJ": {"name_cn": "主人公", "name_en": "Protagonist", "color": "#16A34A"},
        "ENFP": {"name_cn": "竞选者", "name_en": "Campaigner", "color": "#EAB308"},
        "ISTJ": {"name_cn": "物流师", "name_en": "Logistician", "color": "#2563EB"},
        "ISFJ": {"name_cn": "守卫者", "name_en": "Defender", "color": "#0D9488"},
        "ESTJ": {"name_cn": "总经理", "name_en": "Executive", "color": "#0891B2"},
        "ESFJ": {"name_cn": "执政官", "name_en": "Consul", "color": "#C026D3"},
        "ISTP": {"name_cn": "鉴赏家", "name_en": "Virtuoso", "color": "#4F46E5"},
        "ISFP": {"name_cn": "探险家", "name_en": "Adventurer", "color": "#BE185D"},
        "ESTP": {"name_cn": "企业家", "name_en": "Entrepreneur", "color": "#E11D48"},
        "ESFP": {"name_cn": "表演者", "name_en": "Entertainer", "color": "#F59E0B"},
    }
    
    info = TYPE_INFO.get(mbti_type, TYPE_INFO["INTJ"])
    
    # 雷达图数据（归一化到0-100）
    radar_data = [
        int(result.score_e / 15 * 100),
        int(result.score_s / 15 * 100),
        int(result.score_t / 15 * 100),
        int(result.score_j / 15 * 100),
    ]
    
    # 分数
    scores = {
        "EI": {"E": result.score_e, "I": result.score_i, "dominant": e_or_i},
        "SN": {"S": result.score_s, "N": result.score_n, "dominant": s_or_n},
        "TF": {"T": result.score_t, "F": result.score_f, "dominant": t_or_f},
        "JP": {"J": result.score_j, "P": result.score_p, "dominant": j_or_p},
    }
    
    # 维度解读（付费内容）
    DIMENSION_ANALYSIS = {
        "EI": f"你在外向/内向维度表现为{'偏向社交、从外部世界获取能量' if e_or_i == 'E' else '偏向独处、从内心世界获取能量'}，能量分配指数{abs(result.score_e - result.score_i)/15:.0%}",
        "SN": f"你的信息收集风格是{'脚踏实地的感觉型' if s_or_n == 'S' else '富有想象力的直觉型'}，偏好指数{abs(result.score_s - result.score_n)/15:.0%}",
        "TF": f"决策方式偏向{'理性客观的思考' if t_or_f == 'T' else '重视人情价值的情感'}，平衡指数{abs(result.score_t - result.score_f)/15:.0%}",
        "JP": f"生活方式是{'有计划、爱控制的判断型' if j_or_p == 'J' else '灵活开放、顺其自然的知觉型'}，适应指数{abs(result.score_j - result.score_p)/15:.0%}",
    }
    
    # 职业建议（付费内容）
    CAREER_MAP = {
        "INTJ": ["战略咨询师", "数据科学家", "建筑师", "知识产权律师"],
        "INTP": ["哲学家", "研发工程师", "大学教授", "系统分析师"],
        "ENTJ": ["CEO", "投资银行家", "管理咨询", "创业者"],
        "ENTP": ["创业者", "律师", "公共关系专家", "发明家"],
        "INFJ": ["心理咨询师", "作家", "慈善顾问", "神职人员"],
        "INFP": ["小说家", "诗人", "心理咨询师", "社会工作者"],
        "ENFJ": ["人力资源经理", "培训师", "政治家", "心理咨询师"],
        "ENFP": ["记者", "广告创意", "演员", "活动策划"],
        "ISTJ": ["会计", "审计师", "律师", "军官"],
        "ISFJ": ["护士", "社会工作者", "图书管理员", "HR"],
        "ESTJ": ["项目经理", "法官", "军官", "保险精算师"],
        "ESFJ": ["酒店经理", "销售经理", "教师", "医生"],
        "ISTP": ["机械工程师", "飞行员", "消防员", "信息工程师"],
        "ISFP": ["画家", "设计师", "物理治疗师", "按摩师"],
        "ESTP": ["企业家", "房产经纪", "保险代理", "旅游代理"],
        "ESFP": ["演员", "主持人", "乐队", "社工"],
    }
    
    # 兼容/不兼容类型
    COMPATIBLE = {
        "INTJ": ["ENFP", "INFJ", "INTP", "ENTJ"],
        "INTP": ["ENFJ", "INTJ", "ENTP", "INFJ"],
        "ENTJ": ["INTJ", "ENTP", "INFJ", "ENFP"],
        "ENTP": ["INTJ", "ENTJ", "INFP", "ENFJ"],
        "INFJ": ["ENFP", "INFJ", "INTJ", "INTP"],
        "INFP": ["ENFJ", "INFJ", "ENTP", "INTJ"],
        "ENFJ": ["INFP", "ENFP", "INTJ", "INTP"],
        "ENFP": ["INFJ", "ENFJ", "INTJ", "ENTP"],
        "ISTJ": ["ESFP", "ISFJ", "ESTJ", "ISTP"],
        "ISFJ": ["ESFP", "ISTJ", "ESTP", "ISFP"],
        "ESTJ": ["ISTP", "ISFP", "ESTJ", "ESFJ"],
        "ESFJ": ["ISFP", "ISTP", "ESFJ", "ESTJ"],
        "ISTP": ["ESFJ", "ESTJ", "ISTJ", "ISFJ"],
        "ISFP": ["ESFJ", "ESTJ", "ISTP", "ISFJ"],
        "ESTP": ["ISFJ", "ISTJ", "ESTP", "ESFJ"],
        "ESFP": ["ISFJ", "ISTJ", "ESTP", "ESFJ"],
    }
    
    incompatible_map = {t: [x for x in list(TYPE_INFO.keys())[:8] if x not in v] for t, v in COMPATIBLE.items()}
    
    return {
        "id": str(result.id),
        "type": mbti_type,
        "name_cn": info["name_cn"],
        "name_en": info["name_en"],
        "description": f"{info['name_cn']}（{info['name_en']}）类型的人 {generate_description(mbti_type)}",
        "radar_data": radar_data,
        "scores": scores,
        "dimension_analysis": DIMENSION_ANALYSIS,
        "career_suggestions": CAREER_MAP.get(mbti_type, []),
        "compatible_types": COMPATIBLE.get(mbti_type, []),
        "incompatible_types": incompatible_map.get(mbti_type, [])[:4],
        "color": info["color"],
    }

def generate_description(mbti_type: str) -> str:
    """生成性格描述"""
    DESCRIPTIONS = {
        "INTJ": "具有战略思维和创新精神，善于独立思考和规划未来。",
        "INTP": "逻辑缜密，好奇心强，热爱分析和解决复杂问题。",
        "ENTJ": "天生的领导者，决策果断，擅长组织和激励团队。",
        "ENTP": "思维敏捷，善于辩论和创新，热爱智识挑战。",
        "INFJ": "理想主义者，富有同理心，渴望帮助他人实现潜能。",
        "INFP": "温柔而有原则，追求意义和价值，善于创作。",
        "ENFJ": "充满魅力和同理心，天生的沟通者和激励者。",
        "ENFP": "热情洋溢，创意无限，热爱可能性和新体验。",
        "ISTJ": "可靠务实，责任心强，遵守规则和传统。",
        "ISFJ": "忠诚温暖，乐于奉献，重视和谐和人际关系。",
        "ESTJ": "高效务实，注重结果，天生的管理者和组织者。",
        "ESFJ": "热情友好，社交能力强，重视传统和归属感。",
        "ISTP": "冷静理性，动手能力强，善于解决实际问题。",
        "ISFP": "敏感温柔，艺术气质，热爱自由和美感。",
        "ESTP": "活力四射，适应力强，热爱冒险和实际行动。",
        "ESFP": "乐观开朗，娱乐他人，热爱生活和人际交往。",
    }
    return DESCRIPTIONS.get(mbti_type, "")
