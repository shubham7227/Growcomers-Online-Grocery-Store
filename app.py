from flask import Flask, jsonify, request
from flask_cors import CORS

from methods.chatbot import chatbotResponse
from methods.recommender import loadPopularProducts, loadRelatedProducts, loadRecommendations
from methods.smartSearch import loadSmartSearchProducts
from methods.createNewDF import loadDBListener
from db import productsModel

app = Flask(__name__)
CORS(app)


@app.route('/')
def rootRoute():
    return 'Welcome to GrowComers backend'


@app.route('/product/popular', methods=['GET'])
def getPopularProducts():
    try:
        products = loadPopularProducts()

        return jsonify(data=products), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.route('/product/related', methods=['GET'])
def getRelatedProducts():
    try:
        productId = request.args.get('id')

        if not productId or productId == "undefined":
            return jsonify({"message": "Product Id is required"}), 400

        productData = productsModel.find_one(
            {"_id": productId}, {'title': 1, 'description': 1})

        if not productData or productData == "undefined":
            return jsonify({"message": "No product found"}), 400

        productText = productData['title'] + ' ' + productData['description']

        products = loadRelatedProducts(productId, productText)

        return jsonify(data=products), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


# COLLABORATIVE FILTERING ENDPOINT
@app.route('/user/recommend', methods=['GET'])
def getRecommendedProducts():
    try:
        userId = request.args.get('id')

        if not userId or userId == "undefined":
            return jsonify({"message": "User ID is required"}), 400

        products = loadRecommendations(userId)

        return jsonify(data=products), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.route('/product/search', methods=['GET'])
def getSearchedProducts():
    try:
        query = request.args.get('query')

        products = loadSmartSearchProducts(query)

        return jsonify(data=products), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.route('/chat', methods=['GET'])
def getChatbotReply():
    try:
        query = request.args.get('query')
        res = chatbotResponse(query)
        return jsonify(data=res), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.route('/listen')
def listenDB():
    loadDBListener()
    return 'Listening to MongoDB collection...'


if __name__ == "__main__":
    app.run(port=4002, debug=True)
