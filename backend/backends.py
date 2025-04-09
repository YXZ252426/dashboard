from flask import Flask, request, jsonify
import logging
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def model1(left_key, right_key, left_img, right_img):
    """处理单对图片（带关键词）"""
    logger.info(f"模型1处理: 左眼关键词={left_key}, 右眼关键词={right_key}")
    return [0.3, 0.2, 0.1, 0.1, 0.1, 0.1, 0.05, 0.05]

def model2(left_img, right_img):
    """处理单对图片（不带关键词）"""
    logger.info("模型2处理单对图片")
    return [0.2, 0.15, 0.15, 0.1, 0.1, 0.1, 0.1, 0.1]

@app.route('/api/diagnosis', methods=['POST'])
def handle_diagnosis():
    # 1. 检查必须的文件字段
    if 'Left-Fundus' not in request.files or 'Right-Fundus' not in request.files:
        return jsonify({"error": "必须上传左眼和右眼图片"}), 400

    # 2. 获取数据和图片
    left_key = request.form.get('Left-Diagnostic-Keywords', '')
    right_key = request.form.get('Right-Diagnostic-Keywords', '')
    left_imgs = request.files.getlist('Left-Fundus')
    right_imgs = request.files.getlist('Right-Fundus')

    # 3. 按文件名前缀配对图片
    left_dict = {f.filename.split('_')[0]: f for f in left_imgs}
    right_dict = {f.filename.split('_')[0]: f for f in right_imgs}
    common_keys = sorted(set(left_dict.keys()) & set(right_dict.keys()))

    if not common_keys:
        return jsonify({"error": "没有匹配的图片对"}), 400

    # 4. 生成结果（1对1严格对应）
    results = []
    for key in common_keys:
        if len(common_keys) == 1:
            res = model1(left_key, right_key, left_dict[key], right_dict[key])
        else:
            res = model2(left_dict[key], right_dict[key])
        results.append({"name": key, "result": res})

    logger.info(f"返回结果: {len(results)} 个")
    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)