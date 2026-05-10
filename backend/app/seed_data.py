"""Seed data for dimensions and 60 questions."""

DIMENSIONS = [
    {"code": "EI", "name_cn": "外向-内向", "name_en": "Extravert-Introvert", "pole_a": "E", "pole_b": "I", "sort_order": 1},
    {"code": "SN", "name_cn": "感觉-直觉", "name_en": "Sensing-Intuition", "pole_a": "S", "pole_b": "N", "sort_order": 2},
    {"code": "TF", "name_cn": "思考-情感", "name_en": "Thinking-Feeling", "pole_a": "T", "pole_b": "F", "sort_order": 3},
    {"code": "JP", "name_cn": "判断-知觉", "name_en": "Judging-Perceiving", "pole_a": "J", "pole_b": "P", "sort_order": 4},
]

QUESTIONS = [
    # EI (15 questions)
    {"content": "在社交聚会中，你通常是", "option_a": "主动和陌生人搭话", "option_b": "等待别人来接近你", "dimension": "EI"},
    {"content": "独处时，你感到", "option_a": "需要找点事做", "option_b": "很享受安静", "dimension": "EI"},
    {"content": "你更喜欢", "option_a": "和一群人一起活动", "option_b": "独自或和少数亲密朋友", "dimension": "EI"},
    {"content": "与人交谈时，你倾向于", "option_a": "先听再说", "option_b": "先说再听", "dimension": "EI"},
    {"content": "假期你更想", "option_a": "去热门景点旅游", "option_b": "在家安静休息", "dimension": "EI"},
    {"content": "你更像是", "option_a": "开朗外向的人", "option_b": "沉稳内敛的人", "dimension": "EI"},
    {"content": "面对新朋友时，你通常会", "option_a": "很快变得熟络", "option_b": "需要时间慢慢了解", "dimension": "EI"},
    {"content": "你更愿意在", "option_a": "忙碌的办公室工作", "option_b": "安静的独立空间工作", "dimension": "EI"},
    {"content": "参加活动时，你更可能", "option_a": "提前告诉大家你要来", "option_b": "临时决定是否参加", "dimension": "EI"},
    {"content": "你从社交活动中获得", "option_a": "能量和动力", "option_b": "消耗能量需要恢复", "dimension": "EI"},
    {"content": "当众发言时，你感到", "option_a": "兴奋和期待", "option_b": "紧张和不安", "dimension": "EI"},
    {"content": "你喜欢", "option_a": "电话或视频聊天", "option_b": "发文字消息", "dimension": "EI"},
    {"content": "在团队讨论中，你通常", "option_a": "积极发表意见", "option_b": "先听别人怎么说", "dimension": "EI"},
    {"content": "你更喜欢的生活方式是", "option_a": "丰富多彩的社交", "option_b": "安静有规律的独处", "dimension": "EI"},
    {"content": "结交朋友后，你倾向于", "option_a": "经常联系维护", "option_b": "偶尔联系但感情不变", "dimension": "EI"},
    # SN (15 questions)
    {"content": "你更关注", "option_a": "具体的事实和数据", "option_b": "未来的可能性", "dimension": "SN"},
    {"content": "当你阅读时，你倾向于注意", "option_a": "实际的细节", "option_b": "隐含的意义和比喻", "dimension": "SN"},
    {"content": "你更相信", "option_a": "经验和实践证明", "option_b": "直觉和灵感", "dimension": "SN"},
    {"content": "处理问题时，你更看重", "option_a": "现实可行的方案", "option_b": "创意和新颖的方法", "dimension": "SN"},
    {"content": "你更喜欢", "option_a": "按照已知的方法做事", "option_b": "尝试全新的方法", "dimension": "SN"},
    {"content": "学习中，你更擅长", "option_a": "记忆具体的事实", "option_b": "理解抽象的概念", "dimension": "SN"},
    {"content": "你更感兴趣的是", "option_a": "此时此刻发生的事情", "option_b": "未来可能发生的事情", "dimension": "SN"},
    {"content": "当你描述一件事时，你倾向于", "option_a": "详细描述具体细节", "option_b": "概括整体和背后的原因", "dimension": "SN"},
    {"content": "你更重视", "option_a": "实际的经验", "option_b": "理论上的推演", "dimension": "SN"},
    {"content": "面对选择时，你更看重", "option_a": "过往的成功经验", "option_b": "新的可能性和机会", "dimension": "SN"},
    {"content": "你喜欢", "option_a": "可预测的常规生活", "option_b": "充满变化的新鲜感", "dimension": "SN"},
    {"content": "在讨论中，你更常引用", "option_a": "事实和数据", "option_b": "个人的想法和直觉", "dimension": "SN"},
    {"content": "你更愿意", "option_a": "按照计划一步步执行", "option_b": "随情况灵活调整", "dimension": "SN"},
    {"content": "学习新东西时，你喜欢", "option_a": "从头开始打好基础", "option_b": "先了解整体框架", "dimension": "SN"},
    {"content": "你更相信", "option_a": "看得见摸得着的", "option_b": "想象和推理出来的", "dimension": "SN"},
    # TF (15 questions)
    {"content": "做决定时，你更注重", "option_a": "逻辑和客观分析", "option_b": "对他人的影响", "dimension": "TF"},
    {"content": "当你认为对的事情和别人冲突时，你倾向于", "option_a": "坚持自己的观点", "option_b": "考虑他人的感受", "dimension": "TF"},
    {"content": "你更认同", "option_a": "公平比仁慈更重要", "option_b": "仁慈比公平更重要", "dimension": "TF"},
    {"content": "当你给别人建议时，你更看重", "option_a": "建议是否合理有效", "option_b": "对方是否会受到伤害", "dimension": "TF"},
    {"content": "你觉得自己更", "option_a": "理性冷静", "option_b": "重感情", "dimension": "TF"},
    {"content": "在争论中，你更在意", "option_a": "谁说得有道理", "option_b": "不要伤害对方的感情", "dimension": "TF"},
    {"content": "你觉得评判对错应该用", "option_a": "客观的标准", "option_b": "因人而异", "dimension": "TF"},
    {"content": "你更愿意", "option_a": "说实话即使可能伤人", "option_b": "委婉表达以维护关系", "dimension": "TF"},
    {"content": "你做决定时", "option_a": "先分析利弊", "option_b": "先考虑各方感受", "dimension": "TF"},
    {"content": "你更欣赏", "option_a": "做事有效率的人", "option_b": "善解人意的人", "dimension": "TF"},
    {"content": "当朋友遇到问题时，你更可能", "option_a": "帮他分析问题和解决方案", "option_b": "先倾听和安慰他", "dimension": "TF"},
    {"content": "你觉得", "option_a": "规则和制度更重要", "option_b": "人与人之间的关系更重要", "dimension": "TF"},
    {"content": "你更倾向于", "option_a": "做正确的事", "option_b": "做善良的事", "dimension": "TF"},
    {"content": "你更容易被", "option_a": "有逻辑有道理的说辞说服", "option_b": "真诚感人的表达打动", "dimension": "TF"},
    {"content": "你觉得人应该", "option_a": "更多依靠理性", "option_b": "更多依靠感情", "dimension": "TF"},
    # JP (15 questions)
    {"content": "你更喜欢", "option_a": "有计划有安排", "option_b": "随心所欲灵活应变", "dimension": "JP"},
    {"content": "你的生活通常是", "option_a": "井井有条", "option_b": "随性自在", "dimension": "JP"},
    {"content": "面对任务时，你通常会", "option_a": "制定计划然后执行", "option_b": "边做边看随机应变", "dimension": "JP"},
    {"content": "你更不喜欢", "option_a": "事情悬而未决", "option_b": "过于死板没有变通", "dimension": "JP"},
    {"content": "你更喜欢", "option_a": "提前完成任务", "option_b": "在最后一刻完成", "dimension": "JP"},
    {"content": "你觉得截止日期是", "option_a": "必须严格遵守的", "option_b": "可以灵活调整的", "dimension": "JP"},
    {"content": "你更倾向于", "option_a": "按照清单做事", "option_b": "想到什么做什么", "dimension": "JP"},
    {"content": "你喜欢", "option_a": "确定的事项", "option_b": "开放的可能性", "dimension": "JP"},
    {"content": "你更容易因为", "option_a": "没有完成任务而不安", "option_b": "计划被打断而烦躁", "dimension": "JP"},
    {"content": "你更欣赏", "option_a": "有条理有组织的人", "option_b": "随性自由有创意的人", "dimension": "JP"},
    {"content": "你更愿意", "option_a": "把事情提前安排好", "option_b": "留出灵活调整的空间", "dimension": "JP"},
    {"content": "你的办公桌通常是", "option_a": "整洁有序", "option_b": "随意堆放但自己知道在哪", "dimension": "JP"},
    {"content": "你更看重", "option_a": "按计划执行", "option_b": "适应变化", "dimension": "JP"},
    {"content": "面对新项目时，你倾向于", "option_a": "先制定详细的计划", "option_b": "先开始做再说", "dimension": "JP"},
    {"content": "你更不喜欢", "option_a": "生活没有秩序", "option_b": "生活太死板无趣", "dimension": "JP"},
]

def seed(db):
    from app.models.dimension import TestDimension
    from app.models.question import TestQuestion
    if db.query(TestDimension).first():
        print("Database already seeded")
        return
    dim_map = {}
    for d in DIMENSIONS:
        dim = TestDimension(**d)
        db.add(dim)
        db.flush()
        dim_map[d["code"]] = dim.id
    for i, q in enumerate(QUESTIONS):
        dim_id = dim_map[q["dimension"]]
        question = TestQuestion(dimension_id=dim_id, question_number=i + 1, content=q["content"],
                                option_a=q["option_a"], option_b=q["option_b"], weight_a=1, weight_b=0)
        db.add(question)
    db.commit()
    print(f"Seeded {len(DIMENSIONS)} dimensions and {len(QUESTIONS)} questions")

if __name__ == "__main__":
    from app.database import SessionLocal
    db = SessionLocal()
    seed(db)
    db.close()
